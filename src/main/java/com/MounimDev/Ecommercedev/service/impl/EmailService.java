package com.MounimDev.Ecommercedev.service.impl;

import com.MounimDev.Ecommercedev.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${app.base-url}") // Add this to application.properties: app.base-url=http://yourdomain.com
    private String baseUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(User user) {
        String subject = "Verify Your Email Address";
        String verificationUrl = baseUrl + "/api/auth/verify-email?token=" + user.getVerificationToken();
        String text = "Dear " + user.getName() + ",\n\n"
                + "Please click the link below to verify your email address:\n"
                + verificationUrl + "\n\n"
                + "If you didn't create an account, please ignore this email.\n\n"
                + "Thank you,\n"
                + "Your E-Commerce Team";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(user.getEmail());
        message.setSubject(subject);
        message.setText(text);
        
        mailSender.send(message);
    }

    // Additional email methods can be added here
    public void sendPasswordResetEmail(User user, String resetToken) {
        // Implementation for password reset
    }
}