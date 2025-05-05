package com.MounimDev.Ecommercedev.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.MounimDev.Ecommercedev.entity.OrderItem;
import com.MounimDev.Ecommercedev.entity.Product;
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
public class OrderDto {
	
	private Long id;
	private BigDecimal totalPrice;
	private LocalDateTime createdAt;
	private List<OrderItemDto> orderItemList;

}
