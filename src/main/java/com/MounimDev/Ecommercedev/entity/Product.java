package com.MounimDev.Ecommercedev.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import org.hibernate.annotations.CreationTimestamp;

import com.MounimDev.Ecommercedev.enums.ProductType;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;





@Data
@Entity
@Table(name = "products")
public class Product {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, unique = true)
    private String productCode;
	
	@Column(nullable = true) // Made nullable if needed
    private String model;
	
	@Column(nullable = false)
	private String name;
	
	 @Enumerated(EnumType.STRING)
	    @Column(nullable = false, length = 40)
	    private ProductType type;
	 
	 @Column(columnDefinition = "json", nullable = true)
	 private String specifications;  // Contains all Excel
	 
	 
	private String description;
	private String imageUrl;
	
	
	@Column(nullable = true)
	private BigDecimal price;
	
	@Column(nullable = false)
    private boolean purchasable = false;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id")
	private Category category;
	
	@Column(name = "created_at")
	@CreationTimestamp
	private  LocalDateTime createdAt;
	
	
	
	
	
	// Helper methods to work with JSON specifications
    public Map<String, Object> getSpecificationsMap() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(specifications, new TypeReference<Map<String, Object>>(){});
        } catch (Exception e) {
            return Map.of();
        }
    }
    
    public void setSpecificationsMap(Map<String, Object> specs) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.specifications = mapper.writeValueAsString(specs);
        } catch (Exception e) {
            this.specifications = "{}";
        }
    }
}
