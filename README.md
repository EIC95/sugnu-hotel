# 🏨 SugnuHotel

Système de réservation hôtelière complet développé dans le cadre d'un projet d'école avec **Laravel 11** (API REST) et **Angular 19** (Frontend).

---

## 📋 Table des matières

- [Présentation](#présentation)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture du projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Base de données](#base-de-données)
- [Lancer le projet](#lancer-le-projet)
- [Comptes de test](#comptes-de-test)
- [Endpoints API](#endpoints-api)
- [Fonctionnalités](#fonctionnalités)
- [Structure des dossiers](#structure-des-dossiers)

---

## Présentation

SugnuHotel est une application web de gestion hôtelière permettant :

- Aux **clients** de rechercher et réserver des chambres en ligne
- Au **personnel** (réceptionnistes) de gérer les arrivées, départs et réservations
- Aux **administrateurs** de configurer et superviser l'ensemble du système

---

## Technologies utilisées

### Backend
| Technologie | Version | Rôle |
|-------------|---------|------|
| PHP | 8.2+ | Langage |
| Laravel | 11 | Framework backend |
| Laravel Sanctum | - | Authentification API |
| Spatie Permission | - | Gestion des rôles |
| MySQL | 8.0+ | Base de données |
| Mailtrap | - | Envoi d'emails (test) |

### Frontend
| Technologie | Version | Rôle |
|-------------|---------|------|
| Angular | 19 | Framework frontend |
| Tailwind CSS | 3+ | Style |
| TypeScript | 5+ | Langage |

---

## Architecture du projet

```
SugnuHotel/
├── backend/          → API Laravel 11
└── frontend/         → Application Angular 19
```

Architecture **Frontend / Backend séparés** :
- Le backend expose une **API REST** sur `http://localhost:8000/api`
- Le frontend Angular consomme cette API sur `http://localhost:4200`
- La communication est sécurisée via des **Bearer tokens** (Sanctum)

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **PHP** >= 8.2
- **Composer**
- **Node.js** >= 18
- **npm** >= 9
- **MySQL** >= 8.0
- **Git**

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/SugnuHotel.git
cd SugnuHotel
```

### 2. Installer le backend

```bash
cd backend
composer install
```

### 3. Installer le frontend

```bash
cd ../frontend
npm install
```

---

## Configuration

### Backend — fichier `.env`

Copiez le fichier d'exemple et configurez-le :

```bash
cd backend
cp .env.example .env
php artisan key:generate
```

Modifiez les variables suivantes dans `.env` :

```env
APP_NAME=SugnuHotel
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sugnuhotel
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre_username_mailtrap
MAIL_PASSWORD=votre_password_mailtrap
MAIL_FROM_ADDRESS=noreply@sugnuhotel.com
MAIL_FROM_NAME="SugnuHotel"
```

> **Note** : Pour les tests, vous pouvez utiliser `MAIL_MAILER=log` pour écrire les emails dans les logs au lieu de les envoyer.

---

## Base de données

### Créer la base de données

Dans MySQL / phpMyAdmin, créez une base de données nommée `sugnuhotel`.

### Lancer les migrations et les seeders

```bash
cd backend
php artisan migrate --seed
```

Cette commande va :
- Créer toutes les tables
- Insérer les rôles (admin, receptionist, client)
- Créer un compte administrateur par défaut
- Insérer des données de test (types de chambres, chambres, services)

### Tables créées

| Table | Description |
|-------|-------------|
| `users` | Utilisateurs (clients, réceptionnistes, admins) |
| `room_types` | Types de chambres (Standard, Deluxe, Suite...) |
| `rooms` | Chambres physiques |
| `room_images` | Photos des chambres |
| `room_amenities` | Équipements des chambres |
| `services` | Services additionnels |
| `reservations` | Réservations |
| `reservation_services` | Services liés aux réservations |
| `reviews` | Avis clients |
| `payments` | Paiements |
| `promotions` | Codes promo |
| `roles` | Rôles (Spatie) |
| `personal_access_tokens` | Tokens Sanctum |

---

## Lancer le projet

### Backend

```bash
cd backend

# Lien symbolique pour les images uploadées
php artisan storage:link

# Lancer le serveur
php artisan serve
```

Le backend sera accessible sur **http://localhost:8000**

### Frontend

```bash
cd frontend
ng serve
```

Le frontend sera accessible sur **http://localhost:4200**

---

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Administrateur | admin@sugnuhotel.com | password123 |
| Réceptionniste | fatou@sugnuhotel.com | password123 |
| Client | amadou@test.com | password123 |

> Les comptes réceptionniste et client sont créés par les seeders de test.

---

## Endpoints API

### Auth
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/login` | Connexion | Non |
| POST | `/api/register` | Inscription (client) | Non |
| POST | `/api/logout` | Déconnexion | Oui |
| GET | `/api/me` | Utilisateur connecté | Oui |

### Chambres
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/rooms` | Liste des chambres | Non |
| GET | `/api/rooms/{id}` | Détail d'une chambre | Non |
| GET | `/api/rooms/available` | Chambres disponibles | Non |
| POST | `/api/rooms` | Créer une chambre | Admin |
| PUT | `/api/rooms/{id}` | Modifier une chambre | Admin |
| DELETE | `/api/rooms/{id}` | Supprimer une chambre | Admin |

### Images
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/rooms/{id}/images` | Upload photos | Admin |
| POST | `/api/rooms/{id}/images/{imageId}/main` | Définir image principale | Admin |
| DELETE | `/api/rooms/{id}/images/{imageId}` | Supprimer une image | Admin |

### Réservations
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/reservations` | Créer une réservation | Client |
| GET | `/api/reservations/{id}` | Détail d'une réservation | Oui |
| GET | `/api/reservations` | Liste toutes les réservations | Admin/Récep |
| PUT | `/api/reservations/{id}` | Modifier une réservation | Admin/Récep |
| DELETE | `/api/reservations/{id}` | Annuler une réservation | Oui |
| POST | `/api/reservations/{id}/checkin` | Check-in | Admin/Récep |
| POST | `/api/reservations/{id}/checkout` | Check-out | Admin/Récep |

### Autres
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/dashboard` | Statistiques | Admin/Récep |
| GET | `/api/services` | Liste des services | Oui |
| POST | `/api/promotions/check` | Vérifier un code promo | Non |
| POST | `/api/reviews` | Laisser un avis | Client |
| POST | `/api/receptionists` | Créer un réceptionniste | Admin |

---

## Fonctionnalités

### Client
- ✅ Inscription et connexion
- ✅ Recherche de chambres disponibles par dates et nombre de personnes
- ✅ Réservation en ligne avec services additionnels
- ✅ Application de codes promo
- ✅ Historique des réservations
- ✅ Annulation de réservation
- ✅ Laisser un avis après séjour
- ✅ Email de confirmation automatique

### Réceptionniste
- ✅ Tableau de bord (arrivées/départs du jour)
- ✅ Processus check-in / check-out
- ✅ Recherche et gestion des réservations
- ✅ Création manuelle de réservations

### Administrateur
- ✅ Tableau de bord avec statistiques complètes
- ✅ Gestion des chambres (CRUD + photos)
- ✅ Gestion des types de chambres
- ✅ Gestion des services additionnels
- ✅ Gestion des codes promotionnels
- ✅ Création de comptes réceptionnistes
- ✅ Supervision de toutes les réservations

### Système
- ✅ Anti double-booking (vérification des conflits de dates)
- ✅ Calcul automatique du prix total
- ✅ Emails de confirmation, modification et annulation
- ✅ Upload et gestion des photos de chambres
- ✅ Authentification sécurisée par tokens

---

## Structure des dossiers

### Backend
```
backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── API/
│   │           ├── AuthController.php
│   │           ├── RoomController.php
│   │           ├── RoomTypeController.php
│   │           ├── RoomImageController.php
│   │           ├── ReservationController.php
│   │           ├── ServiceController.php
│   │           ├── PromotionController.php
│   │           ├── ReviewController.php
│   │           ├── PaymentController.php
│   │           ├── DashboardController.php
│   │           └── CheckInOutController.php
│   ├── Mail/
│   │   ├── ReservationConfirmed.php
│   │   ├── ReservationModified.php
│   │   └── ReservationCancelled.php
│   └── Models/
│       ├── User.php
│       ├── Room.php
│       ├── RoomType.php
│       ├── RoomImage.php
│       ├── RoomAmenity.php
│       ├── Reservation.php
│       ├── Service.php
│       ├── ReservationService.php
│       ├── Review.php
│       ├── Payment.php
│       └── Promotion.php
├── database/
│   ├── migrations/
│   └── seeders/
│       ├── RoleSeeder.php
│       ├── AdminSeeder.php
│       └── HotelSeeder.php
└── routes/
    └── api.php
```

### Frontend
```
frontend/
└── src/app/
    ├── core/
    │   ├── models/
    │   ├── services/
    │   ├── guards/
    │   └── interceptors/
    ├── pages/
    │   ├── public/
    │   ├── client/
    │   ├── receptionist/
    │   └── admin/
    └── shared/
        ├── navbar/
        ├── footer/
        └── room-card/
```