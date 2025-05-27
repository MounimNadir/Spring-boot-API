package com.MounimDev.Ecommercedev.service.interf;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import com.MounimDev.Ecommercedev.dto.Response;
import com.MounimDev.Ecommercedev.enums.ProductType;

public interface ProductService {
    
    Response createProduct(Long categoryId, MultipartFile image, String name, 
            String description, BigDecimal price,
            String productCode, ProductType type,
            Boolean purchasable, Map<String, Object> specifications, String model);
    
    Response updateProduct(Long productId, Long categoryId, MultipartFile image, 
            String name, String description, BigDecimal price,
            String productCode, ProductType type, Boolean purchasable,
            Map<String, Object> specifications, String model);
    
    Response deleteProduct(Long productId);
    
    Response getProductById(Long productId);
    //Response getAllProducts();
    Response getProductsByType(ProductType productType);
    Response getProductsByCategory(Long categoryId);
    Response searchProduct(String searchValue);
    
    Response getSpecificationsSchema(ProductType productType);
    
    Response getDisplayOnlyProducts();
    Response getPurchasableProducts();
    
    
    
    
    Response getPurchasableProductsPaginated(Pageable pageable);
    Response getDisplayOnlyProductsPaginated(Pageable pageable);
    Response getProductsByTypePaginated(ProductType productType, Pageable pageable);
    Response filterProducts(ProductType type, Boolean purchasable, BigDecimal minPrice, 
                          BigDecimal maxPrice, Pageable pageable);
    Response searchProduct(String searchValue, Pageable pageable);
    Response getAllProducts(Pageable pageable);
    default void validatePageable(Pageable pageable) {
        if (pageable.getPageNumber() < 0) {
            throw new IllegalArgumentException("Page index must not be negative");
        }
        if (pageable.getPageSize() < 1 || pageable.getPageSize() > 100) {
            throw new IllegalArgumentException("Page size must be between 1 and 100");
        }
    }
}