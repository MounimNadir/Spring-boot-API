package com.MounimDev.Ecommercedev.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.MounimDev.Ecommercedev.dto.ProductDto;
import com.MounimDev.Ecommercedev.dto.Response;
import com.MounimDev.Ecommercedev.entity.Category;
import com.MounimDev.Ecommercedev.entity.Product;
import com.MounimDev.Ecommercedev.enums.ProductType;
import com.MounimDev.Ecommercedev.exception.NotFoundException;
import com.MounimDev.Ecommercedev.mapper.EntityDtoMapper;
import com.MounimDev.Ecommercedev.repository.CategoryRepo;
import com.MounimDev.Ecommercedev.repository.OrderItemRepo;
import com.MounimDev.Ecommercedev.repository.ProductRepo;
import com.MounimDev.Ecommercedev.security.AwsS3Service;
import com.MounimDev.Ecommercedev.service.interf.ProductService;
import com.MounimDev.Ecommercedev.service.interf.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;
    private final EntityDtoMapper entityDtoMapper;
    private final AwsS3Service awsS3Service;
    private final NotificationService notificationService;
    private final UserService userService;
    private final ObjectMapper objectMapper;
    private final OrderItemRepo orderItemRepo;

    @Override
    public Response createProduct(Long categoryId, MultipartFile image, String name, 
                               String description, BigDecimal price,
                               String productCode, ProductType type,
                               Boolean purchasable, Map<String, Object> specifications, 
                               String model) {
        try {
            // Validate category
            Category category = categoryRepo.findById(categoryId)
                    .orElseThrow(() -> new NotFoundException("Category Not Found"));
            
            // Upload image to S3
            String productImageUrl = awsS3Service.saveImageToS3(image);
            
            // Create and populate product
            Product product = new Product();
            product.setCategory(category);
            product.setName(name);
            product.setDescription(description);
            product.setImageUrl(productImageUrl);
            product.setProductCode(productCode);
            product.setType(type);
            product.setModel(model);
            
            // Handle price and purchasable based on product type
            if (type == ProductType.NEW) {
                product.setPrice(null);
                product.setPurchasable(false);
            } else {
                if (price == null) {
                    throw new IllegalArgumentException("Price is required for " + type + " products");
                }
                product.setPrice(price);
                product.setPurchasable(purchasable != null ? purchasable : false);
            }
            
            // Handle specifications
            if (specifications != null && !specifications.isEmpty()) {
                product.setSpecifications(objectMapper.writeValueAsString(specifications));
            } else if (type == ProductType.RECONDITIONED) {
                throw new IllegalArgumentException("Reconditioned products require specifications");
            }
            
            // Save product
            product = productRepo.save(product);
            
            // Send notification
            notificationService.sendProductOperationEmail(
                userService.getCurrentUser().getEmail(), 
                "created", 
                name
            );
            
            return Response.builder()
                    .status(200)
                    .message("Product successfully created")
                    .product(entityDtoMapper.mapProductToDtobasic(product))
                    .build();
                    
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid specifications format");
        } catch (Exception e) {
            log.error("Error creating product", e);
            throw new RuntimeException("Error creating product: " + e.getMessage());
        }
    }

    @Override
    public Response updateProduct(Long productId, Long categoryId, MultipartFile image, 
            String name, String description, BigDecimal price,
            String productCode, ProductType newType, Boolean purchasable,
            Map<String, Object> specifications, String model) {
        try {
            Product product = productRepo.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));
            
            // Check for duplicate product code
            if (productCode != null && !productCode.equals(product.getProductCode())) {
                Optional<Product> existingProduct = productRepo.findByProductCode(productCode);
                if (existingProduct.isPresent() && !existingProduct.get().getId().equals(productId)) {
                    throw new IllegalArgumentException("Product code already exists");
                }
            }

            ProductType existingType = product.getType();
            
            // TYPE VALIDATION
            if (newType != null && !newType.equals(existingType)) {
                throw new IllegalArgumentException("Product type cannot be changed");
            }

            // PRICE VALIDATION
            if (price != null) {
                if (existingType == ProductType.NEW) {
                    throw new IllegalArgumentException("NEW products cannot have a price");
                }
                product.setPrice(price);
            }

            // PURCHASABLE HANDLING
            if (purchasable != null) {
                if (existingType == ProductType.NEW) {
                    if (purchasable) {
                        throw new IllegalArgumentException("NEW products must remain non-purchasable");
                    }
                } else {
                    product.setPurchasable(purchasable);
                }
            }

            // SPECIFICATIONS VALIDATION
            if (specifications != null) {
                if (existingType == ProductType.RECONDITIONED && specifications.isEmpty()) {
                    throw new IllegalArgumentException("Reconditioned products require specifications");
                }
                product.setSpecifications(objectMapper.writeValueAsString(specifications));
            }

            // COMMON FIELD UPDATES
            if (categoryId != null) {
                product.setCategory(categoryRepo.findById(categoryId)
                     .orElseThrow(() -> new NotFoundException("Category Not Found")));
            }

            if (image != null && !image.isEmpty()) {
                product.setImageUrl(awsS3Service.saveImageToS3(image));
            }

            // Simple field updates
            if (name != null) product.setName(name);
            if (description != null) product.setDescription(description);
            if (productCode != null) product.setProductCode(productCode);
            if (model != null) product.setModel(model);

            Product updatedProduct = productRepo.save(product);

            // Notification
            notificationService.sendProductOperationEmail(
                userService.getCurrentUser().getEmail(),
                "updated", 
                updatedProduct.getName()
            );

            return Response.builder()
                .status(200)
                .message("Product updated successfully")
                .product(entityDtoMapper.mapProductToDtobasic(updatedProduct))
                .success(true)
                .build();
            
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid specifications format");
        } catch (IllegalArgumentException e) {
            // Re-throw validation exceptions to be handled by controller
            throw e;
        } catch (NotFoundException e) {
            // Re-throw not found exceptions
            throw e;
        } catch (Exception e) {
            log.error("Error updating product", e);
            throw new RuntimeException("Error updating product: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Response deleteProduct(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));
        
        // Check if product has associated orders
        if (orderItemRepo.existsByProductId(productId)) {
            throw new DataIntegrityViolationException("Product has associated orders");
        }
        
        productRepo.delete(product);
        
        notificationService.sendProductOperationEmail(
            userService.getCurrentUser().getEmail(),
            "deleted", 
            product.getName()
        );

        return Response.builder()
                .status(HttpStatus.OK.value())
                .message("Product deleted successfully")
                .deletedProductId(productId)
                .build();
    }

    @Override
    public Response getProductById(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));
        return buildProductResponse(product);
    }

 
    @Override
    public Response getAllProducts(Pageable pageable) {
        validatePageable(pageable); // Reuse interface default method
        
        Page<Product> productsPage = productRepo.findAll(pageable);
        
        List<ProductDto> dtos = productsPage.getContent().stream()
            .map(this::mapToDtoWithBusinessLogic)
            .collect(Collectors.toList());

        return buildSuccessResponse(dtos, productsPage.getTotalElements());
    }
    
    // --- Helper Methods ---
    private ProductDto mapToDtoWithBusinessLogic(Product product) {
        ProductDto dto = entityDtoMapper.mapProductToDtobasic(product);
        dto.setPurchasable(product.getType() != ProductType.NEW);
        return dto;
    }
    
    private Response buildSuccessResponse(List<ProductDto> dtos, long totalCount) {
        return Response.builder()
            .status(200)
            .productList(dtos)
            .message("Products retrieved successfully")
            .totalCount((int) totalCount)
            .build();
    }


    @Override
    public Response getProductsByCategory(Long categoryId) {
        List<Product> products = productRepo.findByCategoryId(categoryId);
        if (products.isEmpty()) {
            throw new NotFoundException("No Products found for this category");
        }
        
        List<ProductDto> productDtoList = products.stream()
                .map(this::mapProductToDtoWithSpecs)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .productList(productDtoList)
                .build();
    }

    @Override
    public Response searchProduct(String searchValue) {
        // First try numeric search (for prices)
        try {
            BigDecimal priceValue = new BigDecimal(searchValue);
            List<Product> priceMatches = productRepo.findByPrice(priceValue);
            if (!priceMatches.isEmpty()) {
                return buildSearchResponse(priceMatches);
            }
        } catch (NumberFormatException e) {
            // Not a numeric search term
        }

        // Then try full text search
        List<Product> textMatches = productRepo.fullTextSearch(searchValue, Pageable.unpaged()).getContent();

        // Then try specifications search
        List<Product> specMatches = productRepo.searchInSpecifications(searchValue, Pageable.unpaged()).getContent();

        // Combine results (remove duplicates)
        Set<Product> combinedResults = new LinkedHashSet<>();
        combinedResults.addAll(textMatches);
        combinedResults.addAll(specMatches);

        if (combinedResults.isEmpty()) {
            throw new NotFoundException("No products found matching: " + searchValue);
        }

        return buildSearchResponse(new ArrayList<>(combinedResults));
    }
    
    @Override
    public Response searchProduct(String searchValue, Pageable pageable) {
        // First try numeric search (for prices)
        try {
            BigDecimal priceValue = new BigDecimal(searchValue);
            Page<Product> priceMatches = productRepo.findByPrice(priceValue, pageable);
            if (!priceMatches.isEmpty()) {
                return buildPaginatedSearchResponse(priceMatches.getContent(), priceMatches.getTotalElements());
            }
        } catch (NumberFormatException e) {
            // Not a numeric search term
        }

        // Then try full text search
        Page<Product> textMatches = productRepo.fullTextSearch(searchValue, pageable);

        // Then try specifications search
        Page<Product> specMatches = productRepo.searchInSpecifications(searchValue, pageable);

        // Combine results (remove duplicates)
        Set<Product> combinedResults = new LinkedHashSet<>();
        combinedResults.addAll(textMatches.getContent());
        combinedResults.addAll(specMatches.getContent());

        if (combinedResults.isEmpty()) {
            throw new NotFoundException("No products found matching: " + searchValue);
        }

        return buildPaginatedSearchResponse(
            new ArrayList<>(combinedResults),
            textMatches.getTotalElements() + specMatches.getTotalElements()
        );
    }

    // Helper method for non-paginated search
    private Response buildSearchResponse(List<Product> products) {
        List<ProductDto> dtos = products.stream()
            .map(this::mapProductToDtoWithSpecs)
            .collect(Collectors.toList());
        
        return Response.builder()
            .status(200)
            .message("Found " + dtos.size() + " matching products")
            .productList(dtos)
            .build();
    }

    @Override
    public Response getSpecificationsSchema(ProductType productType) {
        Map<String, Object> schema = Map.of(
            "type", "object",
            "properties", Map.of(
                "color", Map.of(
                    "type", "string",
                    "enum", List.of("red", "blue", "green")
                ),
                "size", Map.of(
                    "type", "string",
                    "enum", List.of("S", "M", "L", "XL")
                )
            ),
            "required", List.of("color", "size")
        );

        return Response.builder()
                .status(200)
                .message("Schema for " + productType)
                .data(schema)
                .build();
    }
    
    @Override
    public Response getProductsByType(ProductType productType) {
        List<Product> products = productRepo.findByType(productType);
        
        if (products.isEmpty()) {
            throw new NotFoundException("No products found for type: " + productType);
        }

        List<ProductDto> productDtoList = products.stream()
            .filter(product -> {
                if (productType == ProductType.NEW) {
                    return product.getPrice() == null;
                } else if (productType == ProductType.RECONDITIONED) {
                    return product.getPrice() != null;
                } else if (productType == ProductType.PART) {
                    return product.isPurchasable();
                }
                return true;
            })
            .map(this::mapProductToDtoWithSpecs)
            .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Products of type: " + productType)
                .productList(productDtoList)
                .build();
    }
    
    @Override
    public Response getDisplayOnlyProducts() {
        List<Product> products = productRepo.findByTypeAndPurchasable(ProductType.NEW, false);
        
        List<ProductDto> productDtos = products.stream()
            .map(entityDtoMapper::mapProductToDtobasic)
            .collect(Collectors.toList());
            
        return Response.builder()
            .status(200)
            .productList(productDtos)
            .message("Display-only products retrieved")
            .build();
    }

    @Override
    public Response getPurchasableProducts() {
        List<Product> products = productRepo.findByPurchasableTrue();
        
        List<ProductDto> productDtos = products.stream()
            .map(entityDtoMapper::mapProductToDtobasic)
            .collect(Collectors.toList());
            
        return Response.builder()
            .status(200)
            .productList(productDtos)
            .message("Purchasable products retrieved")
            .build();
    }

    // Helper methods
    private Response buildProductResponse(Product product) {
        ProductDto productDto = entityDtoMapper.mapProductToDtobasic(product);
        
        if (product.getSpecifications() != null) {
            try {
                Map<String, Object> specs = objectMapper.readValue(
                    product.getSpecifications(), 
                    new TypeReference<Map<String, Object>>() {}
                );
                productDto.setSpecifications(specs);
            } catch (JsonProcessingException e) {
                log.error("Error parsing specifications JSON", e);
            }
        }

        return Response.builder()
                .status(200)
                .product(productDto)
                .build();
    }

    private Response buildPaginatedSearchResponse(List<Product> products, long totalCount) {
        List<ProductDto> dtos = products.stream()
            .map(this::mapProductToDtoWithSpecs)
            .collect(Collectors.toList());
        
        return Response.builder()
            .status(200)
            .message("Found " + dtos.size() + " matching products (out of " + totalCount + ")")
            .productList(dtos)
            .totalCount(totalCount)
            .build();
    }
    
   

    private ProductDto mapProductToDtoWithSpecs(Product product) {
        ProductDto dto = entityDtoMapper.mapProductToDtobasic(product);
        if (product.getSpecifications() != null) {
            try {
                dto.setSpecifications(objectMapper.readValue(
                    product.getSpecifications(),
                    new TypeReference<Map<String, Object>>() {}
                ));
            } catch (JsonProcessingException e) {
                log.error("Error parsing specs for product {}", product.getId(), e);
            }
        }
        return dto;
    }
    
    
    
    
    
    
    @Override
    public Response getPurchasableProductsPaginated(Pageable pageable) {
        Page<Product> products = productRepo.findByPurchasableTrue(pageable);
        
        List<ProductDto> productDtos = products.getContent().stream()
            .map(entityDtoMapper::mapProductToDtobasic)
            .collect(Collectors.toList());
            
        return Response.builder()
            .status(200)
            .productList(productDtos)
            .totalCount(products.getTotalElements())
            .message("Paginated purchasable products retrieved")
            .build();
    }

    @Override
    public Response getDisplayOnlyProductsPaginated(Pageable pageable) {
        Page<Product> products = productRepo.findByTypeAndPurchasable(ProductType.NEW, false, pageable);
        
        List<ProductDto> productDtos = products.getContent().stream()
            .map(entityDtoMapper::mapProductToDtobasic)
            .collect(Collectors.toList());
            
        return Response.builder()
            .status(200)
            .productList(productDtos)
            .totalCount(products.getTotalElements())
            .message("Paginated display-only products retrieved")
            .build();
    }

    @Override
    public Response getProductsByTypePaginated(ProductType productType, Pageable pageable) {
        Page<Product> products = productRepo.findByType(productType, pageable);
        
        if (products.isEmpty()) {
            throw new NotFoundException("No products found for type: " + productType);
        }

        List<ProductDto> productDtoList = products.stream()
            .filter(product -> {
                if (productType == ProductType.NEW) {
                    return product.getPrice() == null;
                } else if (productType == ProductType.RECONDITIONED) {
                    return product.getPrice() != null;
                } else if (productType == ProductType.PART) {
                    return product.isPurchasable();
                }
                return true;
            })
            .map(this::mapProductToDtoWithSpecs)
            .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Paginated products of type: " + productType)
                .productList(productDtoList)
                .totalCount(products.getTotalElements())
                .build();
    }

    @Override
    public Response filterProducts(ProductType type, Boolean purchasable, 
                                 BigDecimal minPrice, BigDecimal maxPrice, 
                                 Pageable pageable) {
        // Validate price range
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new IllegalArgumentException("Minimum price cannot be greater than maximum price");
        }

        Page<Product> products;
        
        if (type != null && purchasable != null && minPrice != null && maxPrice != null) {
            products = productRepo.findByTypeAndPurchasableAndPriceBetween(
                type, purchasable, minPrice, maxPrice, pageable);
        }
        else if (minPrice != null || maxPrice != null) {
            BigDecimal effectiveMin = minPrice != null ? minPrice : BigDecimal.ZERO;
            BigDecimal effectiveMax = maxPrice != null ? maxPrice : new BigDecimal(Long.MAX_VALUE);
            
            if (type != null && purchasable != null) {
                products = productRepo.findByTypeAndPurchasableAndPriceBetween(
                    type, purchasable, effectiveMin, effectiveMax, pageable);
            } else if (type != null) {
                products = productRepo.findByTypeAndPriceBetween(
                    type, effectiveMin, effectiveMax, pageable);
            } else if (purchasable != null) {
                products = productRepo.findByPurchasableAndPriceBetween(
                    purchasable, effectiveMin, effectiveMax, pageable);
            } else {
                products = productRepo.findByPriceBetween(
                    effectiveMin, effectiveMax, pageable);
            }
        }
        // Non-price filters
        else if (type != null && purchasable != null) {
            products = productRepo.findByTypeAndPurchasable(type, purchasable, pageable);
        } else if (type != null) {
            products = productRepo.findByType(type, pageable);
        } else if (purchasable != null) {
            products = productRepo.findByPurchasable(purchasable, pageable);
        } else {
            products = productRepo.findAll(pageable);
        }

        List<ProductDto> productDtos = products.getContent().stream()
            .map(this::mapProductToDtoWithSpecs)
            .collect(Collectors.toList());

        return Response.builder()
            .status(200)
            .productList(productDtos)
            .totalCount(products.getTotalElements())
            .message("Filtered products retrieved")
            .build();
    }
}