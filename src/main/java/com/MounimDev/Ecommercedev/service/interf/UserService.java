package com.MounimDev.Ecommercedev.service.interf;

import org.apache.http.auth.InvalidCredentialsException;

import com.MounimDev.Ecommercedev.dto.LoginRequest;
import com.MounimDev.Ecommercedev.dto.Response;
import com.MounimDev.Ecommercedev.dto.UserDto;
import com.MounimDev.Ecommercedev.entity.User;

public interface UserService {

	
	Response registerUser(UserDto registrationRequest);
	
	Response loginUser(LoginRequest loginRequest) ;
	
	Response getAllUsers();
	
	User getLoginUser();
	
	Response getUserInfoAndOrderHistory();
}
