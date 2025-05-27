package com.MounimDev.Ecommercedev.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.MounimDev.Ecommercedev.dto.ProductDto;
import com.MounimDev.Ecommercedev.dto.Response;
import com.MounimDev.Ecommercedev.entity.Product;
import com.MounimDev.Ecommercedev.enums.ProductType;
import com.MounimDev.Ecommercedev.exception.InvalidCredentialsException;
import com.MounimDev.Ecommercedev.exception.NotFoundException;
import com.MounimDev.Ecommercedev.service.interf.ProductService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/product")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    private final ObjectMapper objectMapper;
    
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> createProduct(
            @RequestParam Long categoryId,
            @RequestParam MultipartFile image,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam String product_code,
            @RequestParam String type,
            @RequestParam Boolean purchasable,
            @RequestParam(required = false) String specificationsJson,
            @RequestParam String model
    ) {
        // Enhanced validation with detailed error messages
        List<String> validationErrors = new ArrayList<>();

        if (categoryId == null) validationErrors.add("categoryId cannot be null");
        if (image == null) validationErrors.add("image file cannot be null");
        else if (image.isEmpty()) validationErrors.add("image file cannot be empty");
        if (name == null) validationErrors.add("name cannot be null");
        else if (name.isEmpty()) validationErrors.add("name cannot be empty");
        if (description == null) validationErrors.add("description cannot be null");
        else if (description.isEmpty()) validationErrors.add("description cannot be empty");
        if (product_code == null) validationErrors.add("product_code cannot be null");
        else if (product_code.isEmpty()) validationErrors.add("product_code cannot be empty");
        if (type == null) validationErrors.add("type cannot be null");
        if (purchasable == null) validationErrors.add("purchasable cannot be null");
        if (model == null) validationErrors.add("model cannot be null");
        else if (model.isEmpty()) validationErrors.add("model cannot be empty");

        if (!validationErrors.isEmpty()) {
            throw new InvalidCredentialsException("Validation errors: " + String.join("; ", validationErrors));
        }

        // Convert type string to enum
        ProductType productType;
        try {
            productType = ProductType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidCredentialsException("Invalid product type. Valid values: " + 
                Arrays.stream(ProductType.values())
                      .map(Enum::name)
                      .collect(Collectors.joining(", ")));
        }

        // Product-type specific validation
        if (productType == ProductType.NEW && price != null) {
            throw new InvalidCredentialsException("NEW products cannot have a price");
        }
        
        if (productType != ProductType.NEW && price == null) {
            throw new InvalidCredentialsException(productType + " products require a price");
        }

        // Parse specifications JSON if provided
        Map<String, Object> specifications = null;
        if (specificationsJson != null && !specificationsJson.isEmpty()) {
            try {
                specifications = objectMapper.readValue(
                    specificationsJson, 
                    new TypeReference<Map<String, Object>>() {}
                );
                
                // Additional validation for certain product types
                if (productType == ProductType.RECONDITIONED && 
                    (specifications == null || specifications.isEmpty())) {
                    throw new InvalidCredentialsException("Reconditioned products require specifications");
                }
            } catch (JsonProcessingException e) {
                throw new InvalidCredentialsException("Invalid specifications JSON format");
            }
        }

        // Call service with all parameters
        try {
            return ResponseEntity.ok(productService.createProduct(
                categoryId, 
                image, 
                name, 
                description, 
                price, // This can be null for NEW products
                product_code,
                productType,
                purchasable,
                specifications,
                model
            ));
        } catch (Exception e) {
            throw new InvalidCredentialsException("Error creating product: " + e.getMessage());
        }
    }

    // [Rest of your controller methods remain unchanged...]
    @PutMapping("/update")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateProduct(
            @RequestParam Long productId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) String product_code,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean purchasable,
            @RequestParam(required = false) String specificationsJson,
            @RequestParam(required = false) String model
    ) {
        try {
            // First get the existing product DTO
            Response existingProductResponse = productService.getProductById(productId);
            ProductDto existingProductDto = existingProductResponse.getProduct();
            ProductType existingType = existingProductDto.getType();

            // If trying to change type, reject the request
            if (type != null && !existingType.name().equalsIgnoreCase(type)) {
                return ResponseEntity.badRequest().body(
                    Response.builder()
                        .status(400)
                        .message("Product type cannot be changed. Current type: " + existingType)
                        .success(false)
                        .build()
                );
            }

            // Parse specifications if provided
            Map<String, Object> specifications = null;
            if (specificationsJson != null && !specificationsJson.isEmpty()) {
                try {
                    specifications = objectMapper.readValue(
                        specificationsJson, 
                        new TypeReference<Map<String, Object>>() {}
                    );
                } catch (JsonProcessingException e) {
                    return ResponseEntity.badRequest().body(
                        Response.builder()
                            .status(400)
                            .message("Invalid specifications JSON format")
                            .success(false)
                            .build()
                    );
                }
            }

            // NEW product specific rules
            if (existingType == ProductType.NEW) {
                // Must have specifications
                if (specifications == null || specifications.isEmpty()) {
                    if (specificationsJson != null) {
                        return ResponseEntity.badRequest().body(
                            Response.builder()
                                .status(400)
                                .message("NEW products must have specifications")
                                .success(false)
                                .build()
                        );
                    }
                    specifications = existingProductDto.getSpecifications();
                }

                // Cannot have price
                if (price != null) {
                    return ResponseEntity.badRequest().body(
                        Response.builder()
                            .status(400)
                            .message("NEW products cannot have a price")
                            .success(false)
                            .build()
                    );
                }

                // Must be non-purchasable
                if (purchasable != null && purchasable) {
                    return ResponseEntity.badRequest().body(
                        Response.builder()
                            .status(400)
                            .message("NEW products must remain non-purchasable")
                            .success(false)
                            .build()
                    );
                }
                price = null;
                purchasable = false;
            }
            // For other product types (USED, RECONDITIONED)
            else {
                // Must have price (if trying to update it)
                if (price == null && existingProductDto.getPrice() == null) {
                    return ResponseEntity.badRequest().body(
                        Response.builder()
                            .status(400)
                            .message(existingType + " products must have a price")
                            .success(false)
                            .build()
                    );
                }

                // RECONDITIONED products must have specifications if being updated
                if (existingType == ProductType.RECONDITIONED 
                    && specificationsJson != null 
                    && (specifications == null || specifications.isEmpty())) {
                    return ResponseEntity.badRequest().body(
                        Response.builder()
                            .status(400)
                            .message("Reconditioned products require specifications")
                            .success(false)
                            .build()
                    );
                }
            }

            // Convert type string to enum if provided
            ProductType productType = null;
            if (type != null) {
                productType = ProductType.valueOf(type.toUpperCase());
            }

            Response response = productService.updateProduct(
                productId, 
                categoryId, 
                image,
                name, 
                description, 
                price, 
                product_code,
                productType != null ? productType : existingType,
                purchasable,
                specifications,
                model
            );

            return ResponseEntity.ok(response);

        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Response.builder()
                    .status(404)
                    .message(e.getMessage())
                    .success(false)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Response.builder()
                    .status(500)
                    .message("Error updating product: " + e.getMessage())
                    .success(false)
                    .build()
            );
        }
    }
    
    
    
    
    @GetMapping("/display-only")
    public ResponseEntity<Response> getDisplayOnlyProducts() {
        return ResponseEntity.ok(productService.getDisplayOnlyProducts());
    }

    @GetMapping("/purchasable")
    public ResponseEntity<Response> getPurchasableProducts() {
        return ResponseEntity.ok(productService.getPurchasableProducts());
    }
    
    
    
    
    @GetMapping("/get-by-type/{productType}")
    public ResponseEntity<Response> getProductsByType(@PathVariable ProductType productType) {
        return ResponseEntity.ok(productService.getProductsByType(productType));
    }
    
    @DeleteMapping("/delete/{productId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteProduct(@PathVariable Long productId) {
        try {
            Response response = productService.deleteProduct(productId);
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Response.builder()
                            .status(HttpStatus.CONFLICT.value())
                            .message("Cannot delete product")
                            .details("This product has existing orders. Please archive it instead.")
                            .build());
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Response.builder()
                            .status(HttpStatus.NOT_FOUND.value())
                            .message(e.getMessage())
                            .build());
        }
    }


    @GetMapping("/get-by-product-id/{productId}")
    public ResponseEntity<Response> getProductById(@PathVariable Long productId){
        return ResponseEntity.ok(productService.getProductById(productId));
    }

    @GetMapping("/get-all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllProducts(
    	    @RequestParam(defaultValue = "id,desc") String sort, // Changed from String[] to String
    	    @RequestParam(defaultValue = "0") int page,
    	    @RequestParam(defaultValue = "10") int size
    	) {
    	
    	log.info("Received sort parameter: {}", sort);
    	
    	String[] parts = sort.split(","); 
    	
    	List<String> allowedFields = List.of("id", "name", "price", "createdAt");
    	if (!allowedFields.contains(parts[0].toLowerCase())) {
    	    throw new IllegalArgumentException("Invalid sort field. Allowed fields: " + allowedFields);
    	}
    	
    	
    	    try {
    	        // Validate format
    	        if (parts.length != 2) {
    	            throw new IllegalArgumentException("Invalid sort format. Expected 'field,direction'");
    	        }
    	        
    	        // Validate direction
    	        if (!List.of("asc", "desc").contains(parts[1].toLowerCase())) {
    	            throw new IllegalArgumentException("Invalid sort direction. Use 'asc' or 'desc'");
    	        }
    	        
    	        // Create Pageable with single sort
    	        Sort.Direction direction = parts[1].equalsIgnoreCase("asc") 
    	            ? Sort.Direction.ASC 
    	            : Sort.Direction.DESC;
    	        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, parts[0]));

    	        Response response = productService.getAllProducts(pageable);
    	        return ResponseEntity.ok(response);

    	    } catch (IllegalArgumentException e) {
    	        return ResponseEntity.badRequest().body(
    	            Response.builder()
    	                .status(400)
    	                .message(e.getMessage())
    	                .build()
    	        );
    	    }
    	}


   

    @GetMapping("/get-by-category-id/{categoryId}")
    public ResponseEntity<Response> getProductsByCategory(@PathVariable Long categoryId){
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<Response> searchForProduct(
            @RequestParam String searchValue,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.searchProduct(searchValue, pageable));
    }
    
    
    
    @GetMapping("/filter")
    public ResponseEntity<Response> filterProducts(
            @RequestParam(required = false) ProductType type,
            @RequestParam(required = false) Boolean purchasable,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.filterProducts(type, purchasable, minPrice, maxPrice, pageable));
    }
    
    @GetMapping("/specs-schema/{productType}")
    public ResponseEntity<Response> getSpecificationsSchema(@PathVariable ProductType productType) {
        return ResponseEntity.ok(productService.getSpecificationsSchema(productType));
    }
    
    
    @GetMapping("/purchasable/paginated")
    public ResponseEntity<Response> getPurchasableProductsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getPurchasableProductsPaginated(pageable));
    }

    @GetMapping("/display-only/paginated")
    public ResponseEntity<Response> getDisplayOnlyProductsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getDisplayOnlyProductsPaginated(pageable));
    }

    @GetMapping("/by-type/paginated/{productType}")
    public ResponseEntity<Response> getProductsByTypePaginated(
            @PathVariable ProductType productType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.getProductsByTypePaginated(productType, pageable));
    }
    
    
}