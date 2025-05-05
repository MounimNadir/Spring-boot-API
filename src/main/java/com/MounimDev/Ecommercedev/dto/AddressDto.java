package com.MounimDev.Ecommercedev.dto;

import java.time.LocalDateTime;

import com.MounimDev.Ecommercedev.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
public class AddressDto {
	
	private Long id;
	private String street;
	private String city;
	private String state;
	private String zipCode;
	private String country;
	
	private UserDto user;
	
	private  LocalDateTime createdAt = LocalDateTime.now();

}
