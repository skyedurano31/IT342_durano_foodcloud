# 🍱 FoodCloud

**A multi-platform food ordering system for campus and dorm delivery.**

FoodCloud is a full-stack monorepo featuring a Spring Boot REST API, a React web client, and two Android mobile apps. Users can browse products by category, manage a shopping cart, place orders with dormitory delivery details, and track order status — all powered by a single backend.

> Built with Java 17, Spring Boot 3, React 19, Kotlin, and Jetpack Compose.


## 📦 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Clients                             │
│  ┌──────────────┐  ┌──────────────────┐                     │
│  │  React Web   │  │  Android App     │                     │
│  │  (web/)      │  │  Jetpack Compose │                     │
│  │              │  │  (mobile3/)      │                     │
│  └──────┬───────┘  └────────┬─────────┘                     │
│         └──────────────────┬─                               │
│                            │ HTTP / REST                    │
├────────────────────────────┼────────────────────────────────┤
│                      ┌─────┴──────┐                         │
│                      │  Backend   │                         │
│                      │  REST API  │                         │
│                      │  :8080     │                         │
│                      └─────┬──────┘                         │
│                            │ JPA / Hibernate                 │
│                      ┌─────┴──────┐                         │
│                      │ PostgreSQL │                         │
│                      │ (Supabase) │                         │
│                      └────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 17, Spring Boot 3.5, Spring Data JPA, Spring Security, Hibernate |
| **Database** | PostgreSQL (hosted on Supabase) |
| **Auth** | BCrypt password hashing, Google OAuth2 |
| **Web Frontend** | React 19, React Router 7, Axios, Vite |
| **Android** | Kotlin, Jetpack Compose, Material 3 |
| **Mobile Networking** | Retrofit 2, OkHttp, Gson |
| **Mobile State** | ViewModel, Jetpack DataStore (session), Coil (images) |
| **Image Upload** | Multipart file upload, server-side storage |
| **Build** | Maven (backend), Gradle (Android), Vite (web) |
| **Deployment** | Supabase (DB), configurable for cloud deploy |

---

## ✨ Features

### 👤 User Features
- **Authentication** — Register / login with username + password or Google OAuth2
- **Browse Products** — View products grouped by category with images and descriptions
- **Cart Management** — Add/remove items, adjust quantities, persist per user
- **Checkout** — Enter delivery details (building, room number, instructions, phone)
- **Order Tracking** — View order history with status updates (Pending, Confirmed, Delivered)
- **Payment** — Simple payment information collection

### 🛠️ Admin Features
- **Product Management** — Create, update, delete products with image upload
- **Category Management** — Organize products into categories
- **Order Management** — View and update order status

### 🏗️ System Features
- **RESTful API** — Single backend serving three independent clients
- **Role-based Access Control** — USER and ADMIN roles with endpoint security
- **CORS Configuration** — Supports web dev server and Android emulator simultaneously
- **Image Upload** — Server-side file storage with UUID-based filenames


---

## 🔌 API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| GET | `/api/auth/me` | Basic/OAuth2 | Get current user info |
| POST | `/api/auth/logout` | Basic | Logout |
| GET | `/api/categories` | — | List all categories |
| GET | `/api/products` | — | List all products |
| GET | `/api/products/{id}` | — | Get product details |
| POST | `/api/products` | ADMIN | Create product (multipart) |
| PUT | `/api/products/{id}` | ADMIN | Update product |
| DELETE | `/api/products/{id}` | ADMIN | Delete product |
| GET | `/api/cart/{userId}` | USER | Get user's cart |
| POST | `/api/cart/add` | USER | Add item to cart |
| POST | `/api/orders` | USER | Place order |
| GET | `/api/orders/user/{userId}` | USER | Get user's orders |
| GET | `/api/orders/{id}` | USER | Get order details |

---

## ⚙️ Configuration

Key configuration in `backend/src/main/resources/application.properties`:

| Property | Description |
|----------|-------------|
| `spring.datasource.url` | PostgreSQL JDBC URL (Supabase pooler port 6543) |
| `spring.datasource.username` | Database username |
| `spring.datasource.password` | Database password |
| `spring.security.oauth2.client.registration.google.*` | Google OAuth2 credentials |
| `file.upload-dir` | Directory for product image uploads (default: `./uploads`) |

> ⚠️ **Security:** The `application.properties` file is gitignored. Use a `.env` approach or environment variables for production secrets. See `application.properties.example` for the template.

---

## 🧪 Built With

- [Spring Boot](https://spring.io/projects/spring-boot) — Backend framework
- [React](https://react.dev) — Web UI library
- [Jetpack Compose](https://developer.android.com/compose) — Android UI toolkit
- [Retrofit](https://square.github.io/retrofit/) — HTTP client for Android
- [Supabase](https://supabase.com) — Hosted PostgreSQL
- [Vite](https://vitejs.dev) — Web build tool

---

## 🙋 About

FoodCloud was built as a **full-stack student project** demonstrating:
- Designing and implementing a RESTful API consumed by multiple client platforms
- Building modern UIs with React (web) and Jetpack Compose (Android)
- Implementing secure authentication (BCrypt + OAuth2) with role-based authorization
- Managing relational data with JPA/Hibernate and PostgreSQL
- Handling file uploads and serving static resources
- Structuring a monorepo with shared API contracts across frontend and mobile

---

*Cebu Institute of Technology — College of Information Technology*
