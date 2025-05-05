package com.MounimDev.Ecommercedev.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.MounimDev.Ecommercedev.entity.Order;
import com.MounimDev.Ecommercedev.entity.Product;
import com.MounimDev.Ecommercedev.entity.User;
import com.MounimDev.Ecommercedev.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderItemDto {
	
	private Long id;
	private int quantity;
	private BigDecimal price;
	private String status;
	private UserDto user;
	private ProductDto product;
	private LocalDateTime createdAt;
}
