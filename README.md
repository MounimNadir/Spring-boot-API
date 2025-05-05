# 🛍️ E-Commerce Backend (Spring Boot REST API)

A high-performance e-commerce backend built with **Spring Boot**, featuring secure JWT authentication, product/order management, and RESTful API design.

---

## 🚀 Features

- **User Authentication**  
  - JWT-based registration/login (`USER`/`ADMIN` roles).  
  - Secure password storage (BCrypt hashing).  

- **Product Management**  
  - CRUD operations for products (admin-only).  
  - Image uploads (AWS S3 or local storage).  
  - Search/filter by category, price, or keywords.  

- **Order Processing**  
  - Place orders with status tracking.  
  - User-specific order history.  

- **RESTful API**  
  - Resource-based endpoints (`/products`, `/orders`).  
  - Proper HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).  
  - Stateless design with JWT.  

---

## 🛠️ Tech Stack

- **Backend**: Spring Boot 3.x, Spring Security, Hibernate  
- **Database**: PostgreSQL / MySQL  
- **Authentication**: JWT  
- **File Storage**: AWS S3 (optional)  
- **Tools**: Lombok, MapStruct, Docker  

---

## 📌 API Endpoints

| Endpoint                | Method | Description                     | Role       |
|-------------------------|--------|---------------------------------|------------|
| `/auth/register`        | POST   | Register a new user             | Public     |
| `/auth/login`           | POST   | Login (returns JWT)             | Public     |
| `/products`             | GET    | Get all products                | Public     |
| `/products/{id}`        | GET    | Get product by ID               | Public     |
| `/products`             | POST   | Create a product (with image)   | ADMIN      |
| `/products/{id}`        | PUT    | Update product                  | ADMIN      |
| `/orders`               | POST   | Place an order                  | USER       |

*(See full [API Documentation](#api-documentation) for details.)*

---

## 🏗️ Project Structure
src/
├── main/
│ ├── java/
│ │ └── com.MounimDev.Ecommercedev/
│ │ ├── controller/ # API endpoints
│ │ ├── dto/ # Data transfer objects
│ │ ├── entity/ # JPA entities
│ │ ├── repository/ # Database repositories
│ │ ├── security/ # JWT and auth configs
│ │ └── service/ # Business logic
│ └── resources/ #  static files



---

## 🚀 Quick Start

1. **Prerequisites**:  
   - Java 17+, Docker (for DB), AWS CLI (if using S3).

2. **Run Locally**:  
   ```bash
   git clone https://github.com/your-repo/ecommerce-backend.git
   cd ecommerce-backend
   docker-compose up -d  # Starts PostgreSQL
   ./mvnw spring-boot:run
