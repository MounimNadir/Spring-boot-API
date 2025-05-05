package com.MounimDev.Ecommercedev.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MounimDev.Ecommercedev.entity.Order;

public interface OrderRepo extends JpaRepository<Order, Long> {

}
