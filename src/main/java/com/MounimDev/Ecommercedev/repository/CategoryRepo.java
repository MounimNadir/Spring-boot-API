package com.MounimDev.Ecommercedev.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MounimDev.Ecommercedev.entity.Category;
import com.MounimDev.Ecommercedev.entity.Product;

public interface CategoryRepo extends JpaRepository<Category, Long> {
	
	@Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.purchasable = true")
	Page<Product> findByCategoryIdAndPurchasable(
	    @Param("categoryId") Long categoryId, 
	    Pageable pageable);

}
