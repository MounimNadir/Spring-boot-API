package com.MounimDev.Ecommercedev.dto;

import java.math.BigDecimal;
import java.util.List;

import com.MounimDev.Ecommercedev.entity.Payment;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data

@JsonIgnoreProperties(ignoreUnknown = true)
public class OrderRequest {
	
	private BigDecimal totalPrice;
	private List<OrderItemRequest> items;
	
	private Payment paymentInfo;

}
