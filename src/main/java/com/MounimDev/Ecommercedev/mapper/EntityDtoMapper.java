package com.MounimDev.Ecommercedev.mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.MounimDev.Ecommercedev.dto.AddressDto;
import com.MounimDev.Ecommercedev.dto.CategoryDto;
import com.MounimDev.Ecommercedev.dto.OrderItemDto;
import com.MounimDev.Ecommercedev.dto.ProductDto;
import com.MounimDev.Ecommercedev.dto.UserDto;
import com.MounimDev.Ecommercedev.entity.Address;
import com.MounimDev.Ecommercedev.entity.Category;
import com.MounimDev.Ecommercedev.entity.OrderItem;
import com.MounimDev.Ecommercedev.entity.Product;
import com.MounimDev.Ecommercedev.entity.User;

@Component
public class EntityDtoMapper {
	
	//map user entity to DTO
	
	public UserDto mapUserToDtoBasic(User user) {
		UserDto userDto = new UserDto();
		
		userDto.setId(user.getId());
		userDto.setPhoneNumber(user.getPhoneNumber());
		userDto.setEmail(user.getEmail());
		userDto.setRole(user.getRole().name());
		userDto.setName(user.getName());
		
		return userDto;
		
	}
	
	//Address to Dto Basic
	
	public AddressDto mapAddressToDtoBasic(Address address) {
		AddressDto addressDto = new AddressDto();
		addressDto.setId(address.getId());
		addressDto.setCity(address.getCity());
		addressDto.setState(address.getState());
		addressDto.setStreet(address.getStreet());
		addressDto.setCountry(address.getCountry());
		addressDto.setZipCode(address.getZipCode());
		
		return addressDto;
	}
	
	//Category to Dto Basic
	
	public CategoryDto mapCategoryToDtoBasic(Category category) {
		CategoryDto categoryDto = new CategoryDto();
		
		categoryDto.setId(category.getId());
		categoryDto.setName(category.getName());
		
		return categoryDto;
		
	}
	
	//OrderItem to Dto  basic
	
	public OrderItemDto mapOrderItemToDtoBasic(OrderItem orderItem) {
		OrderItemDto orderItemDto = new OrderItemDto();
		orderItemDto.setId(orderItem.getId());
		orderItemDto.setQuantity(orderItem.getQuantity());
		orderItemDto.setPrice(orderItem.getPrice());
		orderItemDto.setStatus(orderItem.getStatus().name());
		orderItemDto.setCreatedAt(orderItem.getCreatedAt());
		
		return orderItemDto;
	}
	
	//product to Dto Basic
	
	
	public ProductDto mapProductToDtobasic(Product product) {
		
		ProductDto productDto = new ProductDto();
		productDto.setId(product.getId());
		productDto.setName(product.getName());
		productDto.setDescription(product.getDescription());
		productDto.setImageUrl(product.getImageUrl());
		productDto.setPrice(product.getPrice());
		productDto.setPurchasable(product.isPurchasable());
		productDto.setType(product.getType());
		
		if(product.getSpecifications() != null) {
            productDto.setSpecifications(product.getSpecificationsMap());
        }
		productDto.setModel(product.getModel());
		 if(product.getCategory() != null) {
		        productDto.setCategoryId(product.getCategory().getId());
		        // If you need the full category DTO, you'd map it here
		        // productDto.setCategory(mapCategoryToDto(product.getCategory()));
		    }
		 productDto.setProductCode(product.getProductCode());
		
		
		return productDto;
		
	}
	
	
	
	public UserDto mapUserToDtoPlusAddress(User user) {
		UserDto userDto = mapUserToDtoBasic(user);
		
		if(user.getAddress()!=null) {
			
			
			AddressDto addressDto = mapAddressToDtoBasic(user.getAddress());
			userDto.setAddress(addressDto);
		}
		return userDto;
	}
	
	//orderItem to DTO plus product
	
	public OrderItemDto mapOrderItemToDtoPlusProduct(OrderItem orderItem) {
		OrderItemDto orderItemDto = mapOrderItemToDtoBasic(orderItem);
		
		if(orderItem.getProduct() != null) {
			ProductDto productDto = mapProductToDtobasic(orderItem.getProduct());
			orderItemDto.setProduct(productDto);
			
		}
		
		return orderItemDto;
	}
	
	
	//OrderItem to DTO Plus product and user
	
	public OrderItemDto mapOrderItemToDtoPlusProductAndUser(OrderItem orderItem) {
		OrderItemDto orderItemDto = mapOrderItemToDtoPlusProduct(orderItem);
		
		if(orderItem.getUser() != null) {
			UserDto userDto = mapUserToDtoPlusAddress(orderItem.getUser());
			orderItemDto.setUser(userDto);
			
		}
		
		return orderItemDto;
	}

	//user to DTO with Address and Order Items History
	
	public UserDto mapUserToDtoPlusAddressAndOrderHistory(User user) {
		UserDto userDto = mapUserToDtoPlusAddress(user);
		
		if(user.getOrderItemList() != null && !user.getOrderItemList().isEmpty()) {
			userDto.setOrderItemList(user.getOrderItemList()
					.stream()
					.map(this::mapOrderItemToDtoPlusProduct)
					.collect(Collectors.toList()));
		}
		
		return userDto;
	}
}
