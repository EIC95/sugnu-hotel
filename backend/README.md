# SugnuHotel - Backend

This is the backend API for the SugnuHotel application, built with Laravel 11.

## Requirements

- PHP 8.2+
- Composer
- PostgreSQL or MySQL
- Redis (optional, for caching/queues)

## Installation

1. Install dependencies:
   ```bash
   composer install
   ```

2. Copy the environment file and generate the app key:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. Configure your database settings in `.env`.

4. Run migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```

5. Link the storage directory (for uploaded images):
   ```bash
   php artisan storage:link
   ```

## Running the API

Start the Laravel development server:
```bash
php artisan serve
```
The API will be accessible at `http://localhost:8000/api`.

## Environment Configuration

The backend requires specific environment variables for database connection, email sending (Mailtrap recommended for local dev), and other services. Refer to `.env.example` for the required keys.
