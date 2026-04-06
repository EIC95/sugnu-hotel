# Sugnu Hotel Management System

A comprehensive hotel management solution featuring a robust Laravel-based backend for managing rooms, reservations, payments, and user roles.

## Project Structure

- `backend/`: Laravel 12 API providing the core business logic, database management, and authentication services.

## Getting Started

To get started with the project, please refer to the documentation within the `backend/` directory:

1.  **Backend Setup:** See [backend/GEMINI.md](backend/GEMINI.md) for instructions on setting up the PHP/Laravel environment.

## Main Technologies

- **Backend:** Laravel 12 (PHP 8.2), Sanctum, Spatie Permissions.
- **Database:** SQLite (Development), PostgreSQL/MySQL (Production ready).
- **Frontend:** Integrated Vite/Tailwind for basic administration; designed to be consumed by external clients.

## Development Workflow

1.  **Environment:** Ensure PHP 8.2+, Composer, and Node.js are installed.
2.  **API First:** The project is designed with an API-first approach, using Sanctum for secure token-based authentication.
3.  **Roles:** Supports multiple user roles (Admin, Receptionist, Client) with specific permissions.
