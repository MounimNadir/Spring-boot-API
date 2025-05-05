package com.MounimDev.Ecommercedev.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.MounimDev.Ecommercedev.entity.User;
import com.MounimDev.Ecommercedev.exception.NotFoundException;
import com.MounimDev.Ecommercedev.repository.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepo userRepo;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		User user = userRepo.findByEmail(username)
				.orElseThrow(()-> new NotFoundException("User / Email Not Found"));
		
		
		return AuthUser.builder()
				.user(user)
				.build();
	}
	

}
