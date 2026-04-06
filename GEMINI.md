# Sugnu Hotel Management System

A comprehensive hotel management solution featuring a robust Laravel-based backend for managing rooms, reservations, payments, and user roles, and an Angular-based frontend.

## Project Structure

- `backend/`: Laravel 12 API providing the core business logic, database management, and authentication services.
- `frontend/`: Angular application serving as the client-side interface.

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js & NPM
- SQLite (for development)

### Backend Setup (Laravel)

1.  **Navigate to backend:** `cd backend`
2.  **Install dependencies:** `composer install && npm install`
3.  **Environment:** `cp .env.example .env` then `php artisan key:generate`
4.  **Database:** `touch database/database.sqlite` then `php artisan migrate --seed`
5.  **Run:** `php artisan serve`

### Frontend Setup (Angular)

1.  **Navigate to frontend:** `cd frontend`
2.  **Install dependencies:** `npm install`
3.  **Run:** `ng serve`

## Development Conventions

- **Code Style:** Laravel follows PSR-12 (use `./vendor/bin/pint`). Angular follows Angular style guide.
- **API:** RESTful API with Laravel Sanctum for authentication.
- **Testing:** Backend uses PHPUnit; Frontend uses Vitest.

---
*This file serves as instructional context for Gemini CLI.*
