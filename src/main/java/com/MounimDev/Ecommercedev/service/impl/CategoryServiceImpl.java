package com.MounimDev.Ecommercedev.service.impl;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.MounimDev.Ecommercedev.dto.CategoryDto;
import com.MounimDev.Ecommercedev.dto.Response;
import com.MounimDev.Ecommercedev.entity.Category;
import com.MounimDev.Ecommercedev.exception.NotFoundException;
import com.MounimDev.Ecommercedev.mapper.EntityDtoMapper;
import com.MounimDev.Ecommercedev.repository.CategoryRepo;
import com.MounimDev.Ecommercedev.service.interf.CategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService{
	
	
	private final CategoryRepo categoryRepo;
	private final EntityDtoMapper entityDtoMapper; 
	

	@Override
	public Response createCategory(CategoryDto categoryRequest) {
			
		Category category = new Category();
		category.setName(categoryRequest.getName());
		categoryRepo.save(category);
		
		return Response.builder()
				.status(200)
				.message("Category created successfully")
				.build();
	}

	@Override
	public Response updateCategory(Long categoryId, CategoryDto categoryRequest) {
			Category category = categoryRepo.findById(categoryId).orElseThrow(()->new NotFoundException("Category Not Found"));
			category.setName(categoryRequest.getName());
			categoryRepo.save(category);
			
			return Response.builder()
					.status(200)
					.message(" Category Updated successfully")
					.build();
	}

	@Override
	public Response getAllCategories() {
		List<Category> categories = categoryRepo.findAll();
		
		List<CategoryDto> categoryDtoList = categories.stream()
					.map(entityDtoMapper::mapCategoryToDtoBasic)
					.collect(Collectors.toList());
		
		return Response.builder()
				.status(200)
				.categoryList(categoryDtoList)
				.build();
	}

	@Override
	public Response getCategoryById(Long categoryId) {
		Category category = categoryRepo.findById(categoryId).orElseThrow(()->new NotFoundException("Category Not Found"));
		
		CategoryDto categoryDto = entityDtoMapper.mapCategoryToDtoBasic(category);
		
		return Response.builder()
				.status(200)
				.category(categoryDto)
				.build();
	}

	@Override
	public Response deleteCategory(Long categoryId) {
		Category category = categoryRepo.findById(categoryId).orElseThrow(()->new NotFoundException("Category Not Found"));
		
		categoryRepo.delete(category);
		
		return Response.builder()
				.status(200)
				.message("Category successfully deleted")
				.build();
	}
	
	

}
