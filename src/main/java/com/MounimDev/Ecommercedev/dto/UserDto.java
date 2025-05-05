package com.MounimDev.Ecommercedev.dto;


import java.util.List;


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
public class UserDto {
	
	private Long id;
	private String name;
	private String email;
	private String password;
	private String phoneNumber;
	private String role;
	private List<OrderItemDto> orderItemList;
	private AddressDto address;

}
