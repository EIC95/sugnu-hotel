# Sugnu Hotel - Backend

This is the backend for the Sugnu Hotel management system, built with Laravel 12. It provides a robust API for managing hotel operations, including room bookings, user authentication, role-based access control, payments, and promotions.

## Project Overview

- **Framework:** Laravel 12
- **Language:** PHP 8.2+
- **Database:** SQLite (default for development), support for PostgreSQL/MySQL
- **Authentication:** Laravel Sanctum (Token-based)
- **Role Management:** Spatie Laravel Permission
- **Frontend/Build:** Vite, TailwindCSS (for administrative views if any)
- **Architecture:** RESTful API with dedicated Controllers for Auth, Rooms, Reservations, Payments, etc.

## Core Features

- **Authentication & Authorization:** Secure login/register and role-based access (Admin, Receptionist, Client).
- **Room Management:** CRUD operations for room types and individual rooms, including image uploads and amenities.
- **Reservation System:** Booking flow with availability checks, check-in/check-out management, and special requests.
- **Services & Promotions:** Add-on services for reservations and discount code validation.
- **Reviews & Payments:** Client feedback system and payment tracking.
- **Dashboard:** Overview for staff and administrators.

## Building and Running

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js & NPM
- SQLite (or your preferred database)

### Setup Instructions

1.  **Clone the repository and navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    composer install
    npm install
    ```

3.  **Configure environment:**
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4.  **Database setup:**
    ```bash
    # Create the SQLite database file if using SQLite
    touch database/database.sqlite
    
    # Run migrations and seeders
    php artisan migrate --seed
    ```

5.  **Run the development server:**
    ```bash
    # Using the project's custom dev script
    composer run dev
    
    # Or manually in separate terminals
    php artisan serve
    npm run dev
    ```

### Testing

Run the test suite using PHPUnit:
```bash
php artisan test
```

## Development Conventions

- **Code Style:** Follows PSR-12 coding standards. Laravel Pint is included for automated linting (`./vendor/bin/pint`).
- **API Design:** Routes are defined in `routes/api.php` using `auth:sanctum` for protected resources.
- **Models:** Eloquent models are used for database interactions, with defined relationships for Reservations, Rooms, Users, etc.
- **Security:** Ensure all sensitive endpoints are protected by appropriate middleware (`auth:sanctum`, `role:admin`, etc.).

## Key Directories

- `app/Http/Controllers/API`: Contains all REST API controllers.
- `app/Models`: Eloquent models defining the business logic and relationships.
- `database/migrations`: Database schema definitions.
- `database/seeders`: Initial data for development (Roles, Admin user, Hotel data).
- `routes/api.php`: Primary entry point for all API endpoints.
