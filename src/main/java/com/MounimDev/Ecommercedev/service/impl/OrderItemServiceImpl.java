package com.MounimDev.Ecommercedev.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.MounimDev.Ecommercedev.dto.OrderItemDto;
import com.MounimDev.Ecommercedev.dto.OrderRequest;
import com.MounimDev.Ecommercedev.dto.Response;
import com.MounimDev.Ecommercedev.entity.Order;
import com.MounimDev.Ecommercedev.entity.OrderItem;
import com.MounimDev.Ecommercedev.entity.Product;
import com.MounimDev.Ecommercedev.entity.User;
import com.MounimDev.Ecommercedev.enums.OrderStatus;
import com.MounimDev.Ecommercedev.exception.NotFoundException;
import com.MounimDev.Ecommercedev.mapper.EntityDtoMapper;
import com.MounimDev.Ecommercedev.repository.OrderItemRepo;
import com.MounimDev.Ecommercedev.repository.OrderRepo;
import com.MounimDev.Ecommercedev.repository.ProductRepo;
import com.MounimDev.Ecommercedev.service.interf.OrderItemService;
import com.MounimDev.Ecommercedev.service.interf.UserService;
import com.MounimDev.Ecommercedev.specification.orderItemSpecification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderItemServiceImpl implements OrderItemService {
	
	
	
		private final OrderRepo orderRepo;
	    private final OrderItemRepo orderItemRepo;
	    private final ProductRepo productRepo;
	    private final UserService userService;
	    private final EntityDtoMapper entityDtoMapper;

	
	
	
	@Override
	public Response placeOrder(OrderRequest orderRequest) {
		User user = userService.getLoginUser();
		
		//map order request items to order entities

        List<OrderItem> orderItems = orderRequest.getItems().stream().map(orderItemRequest -> {
            Product product = productRepo.findById(orderItemRequest.getProductId())
                    .orElseThrow(()-> new NotFoundException("Product Not Found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(orderItemRequest.getQuantity());
            orderItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(orderItemRequest.getQuantity()))); //set price according to the quantity
            orderItem.setStatus(OrderStatus.PENDING);
            orderItem.setUser(user);
            return orderItem;

        }).collect(Collectors.toList());

        //calculate the total price
        BigDecimal totalPrice = orderRequest.getTotalPrice() != null && orderRequest.getTotalPrice().compareTo(BigDecimal.ZERO) > 0
                ? orderRequest.getTotalPrice()
                : orderItems.stream().map(OrderItem::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add);

        //create order entity
        Order order = new Order();
        order.setOrderItemList(orderItems);
        order.setTotalPrice(totalPrice);

        //set the order reference in each orderitem
        orderItems.forEach(orderItem -> orderItem.setOrder(order));

        orderRepo.save(order);

        return Response.builder()
                .status(200)
                .message("Order was successfully placed")
                .build();
	}

	@Override
	public Response updateOrderItemStatus(Long orderItemId, String status) {
		OrderItem orderItem = orderItemRepo.findById(orderItemId)
                .orElseThrow(()-> new NotFoundException("Order Item not found"));

        orderItem.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        orderItemRepo.save(orderItem);
        return Response.builder()
                .status(200)
                .message("Order status updated successfully")
                .build();
	}

	@Override
	public Response filterOrderItems(OrderStatus status, LocalDateTime startDate, LocalDateTime endDate, Long itemId,
			Pageable pageable) {
		 Specification<OrderItem> spec = Specification.where(orderItemSpecification.hasStatus(status))
	                .and(orderItemSpecification.createdBetween(startDate, endDate))
	                .and(orderItemSpecification.hasItemId(itemId));

	        Page<OrderItem> orderItemPage = orderItemRepo.findAll(spec, pageable);

	        if (orderItemPage.isEmpty()){
	            throw new NotFoundException("No Order Found");
	        }
	        List<OrderItemDto> orderItemDtos = orderItemPage.getContent().stream()
	                .map(entityDtoMapper::mapOrderItemToDtoPlusProductAndUser)
	                .collect(Collectors.toList());

	        return Response.builder()
	                .status(200)
	                .orderItemList(orderItemDtos)
	                .totalPage(orderItemPage.getTotalPages())
	                .totalElement(orderItemPage.getTotalElements())
	                .build();
	}
	
	

}
