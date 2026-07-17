# 🍱 FoodCloud

**A multi-platform food ordering system for campus and dorm delivery.**

FoodCloud is a full-stack monorepo featuring a Spring Boot REST API, a React web client, and two Android mobile apps. Users can browse products by category, manage a shopping cart, place orders with dormitory delivery details, and track order status — all powered by a single backend.

> Built with Java 17, Spring Boot 3, React 19, Kotlin, and Jetpack Compose.

---

## 📱 Screenshots

> *(Add screenshots here — homepage, product listing, cart, and mobile views)*

| Web Home | Web Products | Android Home |
|:---:|:---:|:---:|
| | | |

---

## 📦 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Clients                              │
│  ┌──────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │  React Web   │  │  Android App     │  │  Android App  │  │
│  │  (web/)      │  │  Jetpack Compose │  │  XML Layouts  │  │
│  │              │  │  (mobile3/)      │  │  (mobile/)    │  │
│  └──────┬───────┘  └────────┬─────────┘  └───────┬───────┘  │
│         └──────────────────┬──────────────────────┘         │
│                            │ HTTP / REST                     │
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

## 📁 Project Structure

```
foodcloud/
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/.../
│   │   ├── config/             # Security, CORS, web config
│   │   ├── controller/         # REST controllers
│   │   ├── dto/                # Data transfer objects
│   │   ├── entity/             # JPA entities
│   │   ├── repository/         # Spring Data repositories
│   │   └── service/            # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── web/                        # React frontend
│   ├── src/
│   │   ├── api/                # Axios config & API calls
│   │   ├── components/         # Shared components (Navbar, etc.)
│   │   ├── contexts/           # React context (UserContext)
│   │   ├── hooks/              # Custom hooks (useCart, useOrders, useProducts)
│   │   ├── pages/              # Route pages
│   │   └── App.jsx / main.jsx
│   └── package.json
│
├── mobile3/                    # Android app (Jetpack Compose)
│   ├── app/src/main/java/.../
│   │   ├── data/api/           # Retrofit API service
│   │   ├── data/models/        # Data classes
│   │   ├── data/repository/    # Repository layer
│   │   ├── ui/screens/         # Compose screens (auth, cart, checkout, home, orders)
│   │   ├── ui/theme/           # Material 3 theme
│   │   ├── utils/              # SessionManager (DataStore)
│   │   └── viewmodel/          # ViewModels
│   └── app/build.gradle.kts
│
├── mobile/                     # Android app (XML layouts)
│   ├── app/src/main/java/.../
│   │   ├── models/             # Data models
│   │   ├── network/            # Retrofit client & API
│   │   └── *.Activity.kt       # Activity-based screens
│   └── app/build.gradle.kts
│
└── docs/
    └── Durano_foodcloud_SDD.docx  # Software Design Document
```

---

## 🚀 Getting Started

### Prerequisites
- **JDK 17+**
- **Node.js 20+** and npm
- **Android Studio** (for mobile builds)
- **PostgreSQL** (or a Supabase account for hosted DB)

### 1. Database Setup

Create a PostgreSQL database, or use [Supabase](https://supabase.com) (free tier works). The schema auto-generates via Hibernate's `ddl-auto=update`.

### 2. Backend

```bash
cd backend

# Configure your database credentials
cp src/main/resources/application.properties src/main/resources/application.properties.example
# Edit application.properties with your DB URL, username, and password
# Or use environment variables

./mvnw spring-boot:run
```

The API starts at `http://localhost:8080`.

### 3. Web Frontend

```bash
cd web
npm install
npm run dev
```

Opens at `http://localhost:5173`.

### 4. Android App

Open the `mobile3/` (or `mobile/`) folder in Android Studio, sync Gradle, and run on an emulator or device.

> **Note:** The Android emulator accesses the local backend at `http://10.0.2.2:8080`. CORS is pre-configured for this.

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

Full endpoint documentation available in the backend source controllers.

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

## 📄 License

This project is for educational and portfolio purposes.

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
