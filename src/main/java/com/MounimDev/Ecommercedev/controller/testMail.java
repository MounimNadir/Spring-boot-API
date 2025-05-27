package com.MounimDev.Ecommercedev.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class testMail {

	@Autowired
    private JavaMailSender mailSender;
    
	@GetMapping("/send-test-email")
	public ResponseEntity<?> sendTestEmail() {
	    try {
	        SimpleMailMessage message = new SimpleMailMessage();
	        message.setFrom("mounimnadir7@gmail.com");  // Explicit from address
	        message.setTo("mounimconcour@gmail.com");
	        message.setSubject("SMTP Test");
	        message.setText("If you receive this, SMTP is working!");
	        mailSender.send(message);
	        return ResponseEntity.ok("Test email sent");
	    } catch (MailAuthenticationException e) {
	        return ResponseEntity.status(500).body("SMTP Authentication Failed: " + e.getMessage());
	    } catch (MailSendException e) {
	        return ResponseEntity.status(500).body("Email Send Failed: " + e.getMessage());
	    }
	}
}
