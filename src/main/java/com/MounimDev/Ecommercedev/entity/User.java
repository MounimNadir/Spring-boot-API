package com.MounimDev.Ecommercedev.entity;

import jakarta.persistence.Entity;

import java.time.LocalDateTime;
import java.util.List;



import com.MounimDev.Ecommercedev.enums.UserRole;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name= "users")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank(message = "Name number is required")
	private String name;
	
	@Column(unique = true)
	@NotBlank(message = "Email number is required")
	private String email;
	
	@NotBlank(message = "Password number is required")
	private String password;
	
	@Column(name = "phone_number")
	@NotBlank(message = "Phone number is required")
	private String phoneNumber;
	
	
	private UserRole role;
	
	@OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<OrderItem> orderItemList;
	
	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "user")
	@JoinColumn(name = "address_id")
	private Address address;
	
	@Column(name = "enabled", nullable = false)
	private boolean enabled = false; // Default to false until verified

	@Column(name = "verification_token")
	private String verificationToken;

	@Column(name = "verification_token_expiry")
	private LocalDateTime verificationTokenExpiry;
	
	@Column(name = "created_at")
	private final LocalDateTime createdAt = LocalDateTime.now();
	
	

}
