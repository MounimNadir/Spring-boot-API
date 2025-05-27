package com.MounimDev.Ecommercedev.service.impl;

import java.time.LocalDateTime;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {
	private final JavaMailSender mailSender;
	
	public void sendProductOperationEmail(String adminEmail, String operation, String productName) {
	    try {
	        MimeMessage message = mailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(message, true);
	        
	        helper.setTo(adminEmail);
	        helper.setSubject("Product Operation Notification");
	        
	        String htmlContent = """
	            <html>
	                <body>
	                    <h2 style="color: #2c3e50;">Product Operation Notification</h2>
	                    <p>Dear Admin,</p>
	                    <p>You have successfully <strong>%s</strong> the product: <strong>%s</strong></p>
	                    
	                    <h3 style="color: #3498db;">Operation Details:</h3>
	                    <ul>
	                        <li>Operation Type: %s</li>
	                        <li>Product: %s</li>
	                        <li>Timestamp: %s</li>
	                    </ul>
	                    
	                    <p style="margin-top: 20px;">
	                        <a href="http:///admin/dashboard" 
	                           style="background-color: #3498db; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
	                            View Dashboard
	                        </a>
	                    </p>
	                </body>
	            </html>
	            """.formatted(operation, productName, operation, productName, LocalDateTime.now());
	            
	        helper.setText(htmlContent, true);
	        mailSender.send(message);
	    } catch (MessagingException e) {
	        log.error("Failed to send notification email", e);
	    }
	}

}
