package com.MounimDev.Ecommercedev.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MounimDev.Ecommercedev.dto.AddressDto;
import com.MounimDev.Ecommercedev.dto.Response;
import com.MounimDev.Ecommercedev.service.interf.AddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/address")
@RequiredArgsConstructor
public class AddressController {
	
	private final AddressService addressService;
	
	@PostMapping("/save")
	public ResponseEntity<Response> saveAndUpdateAddress(@RequestBody AddressDto addressDto){
		
		return ResponseEntity.ok(addressService.saveAndUpdateAddress(addressDto));
	}
	

}
