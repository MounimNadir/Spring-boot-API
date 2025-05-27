package com.MounimDev.Ecommercedev.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;


import com.MounimDev.Ecommercedev.enums.ProductType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductDto {

	private Long id;
	private String productCode;
	private String name;
	private ProductType type;
	private Map<String, Object> specifications;
	private String description;
	private String imageUrl;
	private BigDecimal price;
	 private boolean purchasable;
	private CategoryDto category;
	private Long categoryId;
	private String model;
	private LocalDateTime createdAt;
	

}
