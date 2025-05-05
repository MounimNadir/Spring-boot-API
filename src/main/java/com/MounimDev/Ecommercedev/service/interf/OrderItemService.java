package com.MounimDev.Ecommercedev.service.interf;

import java.time.LocalDateTime;

import org.springframework.data.domain.Pageable;

import com.MounimDev.Ecommercedev.dto.OrderRequest;
import com.MounimDev.Ecommercedev.dto.Response;
import com.MounimDev.Ecommercedev.enums.OrderStatus;

public interface OrderItemService {

	Response placeOrder(OrderRequest orderRequest);
	Response updateOrderItemStatus(Long orderItemId, String status);
	
	Response filterOrderItems(OrderStatus status, LocalDateTime startDate , LocalDateTime endDate, Long itemId,Pageable pageable);
}
