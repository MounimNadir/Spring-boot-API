package com.MounimDev.Ecommercedev.controller;
import com.MounimDev.Ecommercedev.dto.Response;
import com.MounimDev.Ecommercedev.service.impl.UserServiceImpl;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class VerificationController {

    private final UserServiceImpl userService;

    public VerificationController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping("/verify-email")
    public Response verifyEmail(@RequestParam String token) {
        return userService.verifyEmail(token);
    }
}