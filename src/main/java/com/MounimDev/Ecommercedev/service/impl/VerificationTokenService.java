package com.MounimDev.Ecommercedev.service.impl;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class VerificationTokenService {
    
    public String generateToken() {
        return UUID.randomUUID().toString();
    }
    
    public LocalDateTime calculateExpiryDate(int expiryTimeInMinutes) {
        return LocalDateTime.now().plusMinutes(expiryTimeInMinutes);
    }
}
