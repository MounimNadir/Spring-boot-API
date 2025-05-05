package com.MounimDev.Ecommercedev.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import com.MounimDev.Ecommercedev.dto.LoginRequest;
import com.MounimDev.Ecommercedev.dto.Response;
import com.MounimDev.Ecommercedev.dto.UserDto;
import com.MounimDev.Ecommercedev.entity.User;
import com.MounimDev.Ecommercedev.enums.UserRole;
import com.MounimDev.Ecommercedev.exception.NotFoundException;
import com.MounimDev.Ecommercedev.exception.InvalidCredentialsException;
import com.MounimDev.Ecommercedev.mapper.EntityDtoMapper;
import com.MounimDev.Ecommercedev.repository.UserRepo;
import com.MounimDev.Ecommercedev.security.JwtUtils;
import com.MounimDev.Ecommercedev.service.interf.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
	
	
	private final UserRepo userRepo;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtils jwtUtils;
	private final EntityDtoMapper entityDtoMapper;

	@Override
	public Response registerUser(UserDto registrationRequest) {
		
		UserRole role = UserRole.USER;
		
		if(registrationRequest.getRole() != null && registrationRequest.getRole().equalsIgnoreCase("admin")) {
			
			role = UserRole.ADMIN;
		}
		
		User user = User.builder()
				.name(registrationRequest.getName())
				.email(registrationRequest.getEmail())
				.password(passwordEncoder.encode(registrationRequest.getPassword()))
				.phoneNumber(registrationRequest.getPhoneNumber())
				.role(role)
				.build();
		
		User savedUser = userRepo.save(user);
		
		UserDto userDto = entityDtoMapper.mapUserToDtoBasic(savedUser);
		
		return Response.builder()
				.status(200)
				.message("User Successfully Added")
				.user(userDto)
				.build();
	}
	
	
	

	@Override
	public Response loginUser(LoginRequest loginRequest)  {
		
		User user = userRepo.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new NotFoundException("Email not found"));
		
		if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
			
			throw new InvalidCredentialsException("password does not match");
			
		}
		
		String token = jwtUtils.generateToken(user);
		
		
		return Response.builder()
				.status(200)
				.message("user Successfully Logged In")
				.token(token)
				.expirationtime("6 Month")
				.role(user.getRole().name())
				.build();
	}

	@Override
	public Response getAllUsers() {
		List<User> users = userRepo.findAll();
		List<UserDto> userDtos = users.stream()
				.map(entityDtoMapper::mapUserToDtoBasic)
				.collect(Collectors.toList());
		
		return Response.builder()
				.status(200)
				.message("Successful")
				.userList(userDtos)
				.build();
	}

	@Override
	public User getLoginUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		String email = authentication.getName();
		log.info("user Email is : " + email);
		return userRepo.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException(" User not found"));
	}

	@Override
	public Response getUserInfoAndOrderHistory() {
		User user = getLoginUser();
		UserDto userDto = entityDtoMapper.mapUserToDtoPlusAddressAndOrderHistory(user);
		
		return Response.builder()
				.status(200)
				.user(userDto)
				.build();
	}
	
	

}
