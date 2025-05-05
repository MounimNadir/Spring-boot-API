package com.MounimDev.Ecommercedev.specification;

import java.time.LocalDateTime;

import org.springframework.data.jpa.domain.Specification;

import com.MounimDev.Ecommercedev.entity.OrderItem;
import com.MounimDev.Ecommercedev.enums.OrderStatus;



public class orderItemSpecification {
	
	public static Specification<OrderItem> hasStatus(OrderStatus status){
		return ((root, query, criteriaBuilder) -> 
		status !=null ? criteriaBuilder.equal(root.get("status"),status) :null);
	}

	
	public static Specification<OrderItem> createdBetween(LocalDateTime startDate, LocalDateTime endDate){
		
		return ((root, query, criteriaBuilder) -> {
			if(startDate != null && endDate != null) {
				return criteriaBuilder.between(root.get("createdAt"), startDate, endDate);
			} else if (startDate != null) {
				return criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startDate);
			} else if (endDate != null) {
				return criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), endDate);
			} else {
				return null;
			}
		});
	}
	
	public static Specification<OrderItem> hasItemId(Long itemId){
		return ((root, query, criteriaBuilder) ->
				itemId != null ? criteriaBuilder.equal(root.get("id"), itemId) : null);
	}
}
