package com.MounimDev.Ecommercedev.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MounimDev.Ecommercedev.entity.Category;

public interface CategoryRepo extends JpaRepository<Category, Long> {

}
