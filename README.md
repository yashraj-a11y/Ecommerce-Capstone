# 🐰 Rabbit - E-Commerce Platform

A modern, full-stack e-commerce website built with Next.js, Node.js, and MySQL, designed to provide a seamless shopping experience for customers and efficient management tools for administrators.

## 📋 Table of Contents

- [Problem Statement](#problem-statement)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [API Overview](#api-overview)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [License](#license)

## 🎯 Problem Statement

This project aims to develop a modern, user-friendly e-commerce website that enables customers to browse, search, and purchase products seamlessly online. The platform features:

- **Dynamic Product Listings** - Real-time product catalog with advanced filtering
- **Secure Payment Integration** - Safe and reliable checkout process
- **Responsive Design** - Optimized experience across all devices
- **Intuitive UI/UX** - Smooth navigation and user flows
- **Admin Dashboard** - Comprehensive management tools for products, orders, and customers

The goal is to create a reliable and scalable digital marketplace that enhances the shopping experience while simplifying business operations.

## 🏗️ System Architecture

The e-commerce system follows a **three-tier architecture** for optimal scalability, maintainability, and performance:

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│                    (Next.js + React.js)                      │
│                      Hosted on Vercel                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ REST API
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                       Backend Layer                          │
│                  (Node.js + Express.js)                      │
│                      Hosted on Render                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Prisma ORM
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                       Database Layer                         │
│                    (MySQL + Prisma)                          │
│                      Hosted on NeonDB                        │
└─────────────────────────────────────────────────────────────┘
```

### Authentication

- **Method**: JWT (JSON Web Token)
- **Security**: Secure token-based authentication for protected routes
- **Role-based Access Control**: Admin and User roles with different permissions

## ✨ Key Features

### 🔐 Authentication & Authorization

Implements secure user registration, login, and logout functionality using JWT-based authentication.

**User Roles:**
- **Admin**: Manage all products, view orders, and handle user accounts
- **User**: Browse products, manage cart, and place orders

Ensures protected routes and restricted access based on user roles.

### 📝 CRUD Operations

Full CRUD (Create, Read, Update, Delete) functionalities for core entities:

- **Products**: Admins can add, edit, or remove products
- **Users**: Update user info and cart operations
- **Orders**: Users can create and view orders; admins can update order status

### 🧭 Frontend Routing

Built with **Next.js App Router** featuring the following pages:

| Page | Description |
|------|-------------|
| **Home** | Display featured and categorized products |
| **Login / Signup** | User authentication and registration |
| **Dashboard** | Personalized area for users or admins |
| **Product Details** | Detailed view with "Add to Cart" and "Buy Now" |
| **Profile** | Manage user information and order history |
| **Cart & Checkout** | Manage cart and complete purchases securely |

### 🔍 Product Search & Filtering

Advanced search and filtering capabilities:
- **Search by Keywords**: Quick product discovery
- **Category Filters**: Browse by product categories
- **Price Range Sliders**: Filter products by price
- **Optimized Shopping Experience**: Fast and intuitive product finding

### ⚡ Dynamic Product Loading

Implements infinite scrolling or "load more" functionality to:
- Dynamically fetch and display products as users scroll
- Improve performance and user experience
- Reduce initial page load time

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js, Next.js, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL, Prisma ORM |
| **Authentication** | JWT (JSON Web Token) |
| **Hosting** | Vercel (Frontend), Render (Backend), NeonDB (Database) |

## 📡 API Overview

### Authentication Endpoints

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/signup` | POST | Register a new user | Public |
| `/api/auth/login` | POST | Authenticate user and return JWT | Public |
| `/api/auth/logout` | POST | Log out user and invalidate token | Authenticated |

### User Endpoints

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/users/:id` | GET | Fetch user profile details | Authenticated |

### Product Endpoints

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/products` | GET | Retrieve all available products | Public |
| `/api/products/:id` | GET | Get details of a specific product | Public |
| `/api/products` | POST | Add a new product to the store | Admin only |
| `/api/products/:id` | PUT | Update product details | Admin only |
| `/api/products/:id` | DELETE | Delete a product from database | Admin only |

### Order Endpoints

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/orders` | POST | Place a new order | Authenticated |
| `/api/orders/:id` | GET | View specific order details | Authenticated |
| `/api/orders` | GET | Get all active orders (admin) | Admin only |

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ecommerce
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Configure Environment Variables**
   
   Create `.env` files in both frontend and backend directories with required configuration:
   
   **Backend `.env`:**
   ```env
   DATABASE_URL="your-neondb-connection-string"
   JWT_SECRET="your-secret-key"
   PORT=5000
   ```
   
   **Frontend `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```

5. **Run Database Migrations**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Start Development Servers**
   
   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🌐 Deployment

### Frontend (Vercel)

The frontend is deployed on Vercel with automatic deployments from the main branch.

### Backend (Render)

The backend API is hosted on Render, providing reliable and scalable server infrastructure.

### Database (NeonDB)

MySQL database hosted on NeonDB for cloud-based data storage and scalability.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for seamless online shopping experiences**
