package com.MounimDev.Ecommercedev.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.MounimDev.Ecommercedev.entity.Category;
import com.MounimDev.Ecommercedev.enums.OrderStatus;
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
	private String name;
	private String description;
	private String imageUrl;
	private BigDecimal price;
	private CategoryDto category;

}
