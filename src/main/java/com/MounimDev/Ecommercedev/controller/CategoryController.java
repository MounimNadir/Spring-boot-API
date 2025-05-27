package com.MounimDev.Ecommercedev.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.MounimDev.Ecommercedev.dto.CategoryDto;
import com.MounimDev.Ecommercedev.dto.Response;
import com.MounimDev.Ecommercedev.service.interf.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
public class CategoryController {
	
	private final CategoryService categoryService;

	@PostMapping("/create")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<Response> createCategory(@RequestBody CategoryDto categoryDto){
		
		return ResponseEntity.ok(categoryService.createCategory(categoryDto));
	}
	
	@GetMapping("/get-all")
	public ResponseEntity<Response> getAllCaregories(){
		return ResponseEntity.ok(categoryService.getAllCategories());
	}
	
	
	@PutMapping("/update/{categoryId}")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<Response> updateCategory(@PathVariable Long categoryId, @RequestBody CategoryDto categoryDto){
		return ResponseEntity.ok(categoryService.updateCategory(categoryId, categoryDto));
	}
	
	
	
	@DeleteMapping("/delete/{categoryId}")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<Response> deleteCategory(@PathVariable Long categoryId){
		return ResponseEntity.ok(categoryService.deleteCategory(categoryId));
	}
	
	
	@GetMapping("/get-category-by-id/{categoryId}")
	public ResponseEntity<Response> getCategoryById(@PathVariable Long categoryId){
		return ResponseEntity.ok(categoryService.getCategoryById(categoryId));
	}
	
	@GetMapping("/get-products-by-category/{categoryId}")
	public ResponseEntity<Response> getProductsByCategory(
	    @PathVariable Long categoryId,
	    @RequestParam(defaultValue = "0") int page,
	    @RequestParam(defaultValue = "8") int size) {
	    return ResponseEntity.ok(categoryService.getProductsByCategory(categoryId, page, size));
	}
	
	
	
	
	
	
	
	
	
	

}
