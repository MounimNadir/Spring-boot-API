package com.MounimDev.Ecommercedev.service.interf;

import com.MounimDev.Ecommercedev.dto.CategoryDto;
import com.MounimDev.Ecommercedev.dto.Response;

public interface CategoryService {

	Response createCategory(CategoryDto categoryRequest);
	
	Response updateCategory(Long categoryId, CategoryDto categoryRequest);
	
	Response getAllCategories();
	
	Response getCategoryById(Long categoryId);
	
	Response deleteCategory(Long categoryId);
	
	Response getProductsByCategory(Long categoryId, int page, int size);
}
