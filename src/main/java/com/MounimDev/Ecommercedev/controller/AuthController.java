package com.MounimDev.Ecommercedev.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MounimDev.Ecommercedev.dto.LoginRequest;
import com.MounimDev.Ecommercedev.dto.Response;
import com.MounimDev.Ecommercedev.dto.UserDto;
import com.MounimDev.Ecommercedev.service.interf.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
	
	private final UserService userService;
	
	
	@PostMapping("/register")
	public ResponseEntity<Response> registerUser(@RequestBody UserDto registrationRequest){
			
		return ResponseEntity.ok(userService.registerUser(registrationRequest));
	}

	
	@PostMapping("/login")
	public ResponseEntity<Response> loginUser(@RequestBody LoginRequest loginRequest){
			
		return ResponseEntity.ok(userService.loginUser(loginRequest));
	}
}
