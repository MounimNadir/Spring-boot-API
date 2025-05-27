package com.MounimDev.Ecommercedev.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Builder
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {
	
	private int status;
	private String message;
	private String details;
	private Long deletedProductId;
	private final LocalDateTime timestamp = LocalDateTime.now();
	
	
	private boolean success;
	
	private String token;
	private String role;
	private String expirationtime;
	
	private int totalPage;
	private long totalElement;
	
	private AddressDto address;
	
	private UserDto user;
	private List<UserDto> userList;
	
	private CategoryDto category;
	private List<CategoryDto> categoryList;
	
	private ProductDto product;
	private List<ProductDto> productList;
	
	private OrderItemDto orderItem;
	private List<OrderItemDto> orderItemList;
	
	private OrderDto order;
	private List<OrderDto> OrderList;
	
	   private Map<String, Object> data;
	   
	   private long totalCount;
	
	   
	   public boolean isSuccess() {
	        return status >= 200 && status < 300;
	    }
	
}
