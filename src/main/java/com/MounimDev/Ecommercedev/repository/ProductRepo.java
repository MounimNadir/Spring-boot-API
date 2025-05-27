 package com.MounimDev.Ecommercedev.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MounimDev.Ecommercedev.entity.Product;
import com.MounimDev.Ecommercedev.enums.ProductType;

public interface ProductRepo extends JpaRepository<Product, Long> {
	
	
	@Query("SELECT p FROM Product p")
    Page<Product> findAllProducts(Pageable pageable);
	
	
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByNameContainingOrDescriptionContaining(String name, String description);
    List<Product> findByType(ProductType type);
    
    // Find by type and purchasable status
    List<Product> findByTypeAndPurchasable(ProductType type, boolean purchasable);

    // Find by type and price range
    List<Product> findByTypeAndPriceBetween(ProductType type, BigDecimal minPrice, BigDecimal maxPrice);
    
    // Paginated versions
    Page<Product> findByTypeAndPurchasable(ProductType type, boolean purchasable, Pageable pageable);
    Page<Product> findByTypeAndPriceBetween(ProductType type, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    // Find by multiple types
    List<Product> findByTypeIn(List<ProductType> types);

    List<Product> findByPurchasableTrue();
    List<Product> findByPurchasableFalse();
    
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.productCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.model) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(CAST(p.type AS string)) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> fullTextSearch(@Param("query") String query);
    
    
    
    
    
    @Query("SELECT p FROM Product p WHERE " +
    	       "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
    	       "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
    	       "LOWER(p.productCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
    	       "LOWER(p.model) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
    	       "LOWER(CAST(p.type AS string)) LIKE LOWER(CONCAT('%', :query, '%'))")
    	Page<Product> fullTextSearch(@Param("query") String query, Pageable pageable);


    // For numeric price search
    @Query("SELECT p FROM Product p WHERE p.price = :priceValue")
    List<Product> findByPrice(@Param("priceValue") BigDecimal priceValue);
    
    
    @Query("SELECT p FROM Product p WHERE p.price = :priceValue")
    Page<Product> findByPrice(@Param("priceValue") BigDecimal priceValue, Pageable pageable);
    
    
     
    // For specifications search (PostgreSQL specific example)
    @Query(value = "SELECT * FROM products WHERE specifications LIKE CONCAT('%', :query, '%')", 
           nativeQuery = true)
    List<Product> searchInSpecifications(@Param("query") String query);
    
    
    
    @Query(value = "SELECT * FROM products WHERE specifications LIKE CONCAT('%', :query, '%')", 
    	       countQuery = "SELECT count(*) FROM products WHERE specifications LIKE CONCAT('%', :query, '%')",
    	       nativeQuery = true)
    	Page<Product> searchInSpecifications(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.purchasable = :purchasable AND " +
    	       "p.price BETWEEN :minPrice AND :maxPrice")
    	Page<Product> findByPurchasableAndPriceBetween(
    	    @Param("purchasable") boolean purchasable,
    	    @Param("minPrice") BigDecimal minPrice,
    	    @Param("maxPrice") BigDecimal maxPrice,
    	    Pageable pageable);
    
    
    Page<Product> findByPurchasableTrue(Pageable pageable);
    Page<Product> findByPurchasable(Boolean purchasable, Pageable pageable);

    Page<Product> findByType(ProductType type, Pageable pageable);
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    Page<Product> findByTypeAndPurchasableAndPriceBetween(ProductType type, boolean purchasable, 
                                                        BigDecimal minPrice, BigDecimal maxPrice, 
                                                        Pageable pageable);
    
    
    Page<Product> findByCategoryIdAndPurchasable(
    	    Long categoryId, 
    	    boolean purchasable, 
    	    Pageable pageable);
    
    Optional<Product> findByProductCode(String productCode);
}