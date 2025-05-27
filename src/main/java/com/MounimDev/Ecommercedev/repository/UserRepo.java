package com.MounimDev.Ecommercedev.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MounimDev.Ecommercedev.entity.User;

public interface UserRepo extends JpaRepository<User, Long>{
	Optional<User> findByEmail(String email);
	User findByVerificationToken(String token);

}
