# 🏨 SugnuHotel

Complete hotel reservation system developed as a **school project** using **Laravel 11** (REST API) and **Angular 19** (Frontend).

---

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database](#database)
- [Running the Project](#running-the-project)
- [Test Accounts](#test-accounts)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Folder Structure](#folder-structure)

---

## Overview

SugnuHotel is a hotel management web application allowing:

- **Clients** to search and book rooms online
- **Staff** (receptionists) to manage check-ins, check-outs, and reservations
- **Administrators** to configure and supervise the entire system

---

## Technologies Used

### Backend
| Technology | Version | Role |
|-------------|---------|------|
| PHP | 8.2+ | Language |
| Laravel | 11 | Backend Framework |
| Laravel Sanctum | - | API Authentication |
| Spatie Permission | - | Role Management |
| PostgreSQL | 15+ | Database |
| Mailtrap | - | Email Testing |

### Frontend
| Technology | Version | Role |
|-------------|---------|------|
| Angular | 19 | Frontend Framework |
| Tailwind CSS | 3+ | Styling |
| TypeScript | 5+ | Language |

---

## Project Architecture

```text
SugnuHotel/
├── backend/          → Laravel 11 API
└── frontend/         → Angular 19 Application
```

**Separated Frontend / Backend** architecture:
- The backend exposes a **REST API** at `http://localhost:8000/api`
- The Angular frontend consumes this API at `http://localhost:4200`
- Communication is secured via **Bearer tokens** (Sanctum)

---

## Prerequisites

Before you begin, ensure you have installed:

- **Docker** and **Docker Compose**
- **PHP** >= 8.2 (optional, if running locally)
- **Composer** (optional, if running locally)
- **Node.js** >= 18 & **npm** >= 9 (optional, if running locally)
- **Git**

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/SugnuHotel.git
cd SugnuHotel
```

### 2. Using Docker (Recommended)

You can easily set up the whole project using Docker.

```bash
docker-compose up --build
```
This will automatically:
- Start the PostgreSQL database (`db`)
- Build and start the Laravel backend (`backend` on port 8000)
- Build and start the Angular frontend (`frontend` on port 4200)
- Run migrations and seed the database

---

## Configuration

### Environment Files

Docker uses the `.env` and `.env.example` files located at the root of the project.
Copy the example file and configure it if necessary:

```bash
cp .env.example .env
```

To configure Laravel manually (if not using Docker), configure the `backend/.env` file.

> **Note**: For email testing, you can use `MAIL_MAILER=log` to write emails to the logs instead of sending them.

---

## Database

### Migrations and Seeders

If you are using Docker, migrations and seeders are executed automatically when the container starts.
If you are running it manually:

```bash
cd backend
php artisan migrate:fresh --seed
```

This command will:
- Create all tables
- Insert roles (admin, receptionist, client)
- Create a default administrator account
- Insert test data (room types, rooms, services)

### Created Tables

| Table | Description |
|-------|-------------|
| `users` | Users (clients, receptionists, admins) |
| `room_types` | Room types (Standard, Deluxe, Suite...) |
| `rooms` | Physical rooms |
| `room_images` | Room photos |
| `room_amenities` | Room amenities |
| `services` | Additional services |
| `reservations` | Reservations |
| `reservation_services` | Services linked to reservations |
| `reviews` | Client reviews |
| `payments` | Payments |
| `promotions` | Promo codes |
| `roles` | Roles (Spatie) |
| `personal_access_tokens` | Sanctum tokens |

---

## Running the Project (Without Docker)

### Backend

```bash
cd backend

# Create symbolic link for uploaded images
php artisan storage:link

# Start the server
php artisan serve
```

The backend will be accessible at **http://localhost:8000**

### Frontend

```bash
cd frontend
npm install
ng serve
```

The frontend will be accessible at **http://localhost:4200**

---

## Test Accounts

| Role | Email | Password |
|------|-------|--------------|
| Administrator | admin@sugnuhotel.com | password123 |
| Receptionist | fatou@sugnuhotel.com | password123 |
| Client | amadou@test.com | password123 |

> The receptionist and client accounts are created by the test seeders.

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/login` | Login | No |
| POST | `/api/register` | Registration (client) | No |
| POST | `/api/logout` | Logout | Yes |
| GET | `/api/me` | Current logged user | Yes |

### Rooms
| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/rooms` | List rooms | No |
| GET | `/api/rooms/{id}` | Room details | No |
| GET | `/api/rooms/available` | Available rooms | No |
| POST | `/api/rooms` | Create a room | Admin |
| PUT | `/api/rooms/{id}` | Update a room | Admin |
| DELETE | `/api/rooms/{id}` | Delete a room | Admin |

### Images
| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/rooms/{id}/images` | Upload photos | Admin |
| POST | `/api/rooms/{id}/images/{imageId}/main` | Set main image | Admin |
| DELETE | `/api/rooms/{id}/images/{imageId}` | Delete an image | Admin |

### Reservations
| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/reservations` | Create a reservation | Client |
| GET | `/api/reservations/{id}` | Reservation details | Yes |
| GET | `/api/reservations` | List all reservations | Admin/Recep |
| PUT | `/api/reservations/{id}` | Update a reservation | Admin/Recep |
| DELETE | `/api/reservations/{id}` | Cancel a reservation | Yes |
| POST | `/api/reservations/{id}/checkin` | Check-in | Admin/Recep |
| POST | `/api/reservations/{id}/checkout` | Check-out | Admin/Recep |

### Others
| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/dashboard` | Statistics | Admin/Recep |
| GET | `/api/services` | List services | Yes |
| POST | `/api/promotions/check` | Check a promo code | No |
| POST | `/api/reviews` | Leave a review | Client |
| POST | `/api/receptionists` | Create a receptionist | Admin |

---

## Features

### Client
- ✅ Registration and login
- ✅ Search for available rooms by dates and number of guests
- ✅ Online booking with additional services
- ✅ Apply promo codes
- ✅ Reservation history
- ✅ Reservation cancellation
- ✅ Leave a review after stay
- ✅ Automatic confirmation email

### Receptionist
- ✅ Dashboard (daily check-ins/check-outs)
- ✅ Check-in / Check-out process
- ✅ Search and manage reservations
- ✅ Manual reservation creation

### Administrator
- ✅ Dashboard with complete statistics
- ✅ Room management (CRUD + photos)
- ✅ Room types management
- ✅ Additional services management
- ✅ Promotional codes management
- ✅ Receptionist account creation
- ✅ Supervision of all reservations

### System
- ✅ Anti double-booking (date conflict verification)
- ✅ Automatic total price calculation
- ✅ Confirmation, modification, and cancellation emails
- ✅ Room photo upload and management
- ✅ Secure token authentication

---

## Folder Structure

### Backend
```text
backend/
├── app/
│   ├── Http/Controllers/API/
│   ├── Mail/
│   └── Models/
├── database/
│   ├── migrations/
│   └── seeders/
└── routes/
    └── api.php
```

### Frontend
```text
frontend/
└── src/app/
    ├── core/ (models, services, guards, interceptors)
    ├── pages/ (public, client, receptionist, admin)
    └── shared/ (navbar, footer, components)
```