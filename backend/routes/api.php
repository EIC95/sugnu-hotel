<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\RoomTypeController;
use App\Http\Controllers\API\RoomController;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\PromotionController;
use App\Http\Controllers\API\CheckInOutController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\RoomImageController;

// Routes publiques
Route::post('/login', [AuthController::class, 'login']);
Route::get('/rooms/available', [RoomController::class, 'available']);
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{id}', [RoomController::class, 'show']);
Route::get('/room-types', [RoomTypeController::class, 'index']);
Route::get('/room-types/{id}', [RoomTypeController::class, 'show']);
Route::post('/promotions/check', [PromotionController::class, 'checkCode']);
Route::post('/register', [AuthController::class, 'register']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Client
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Admin et Réceptionniste
    Route::middleware('role:admin|receptionist')->group(function () {
        Route::apiResource('reservations', ReservationController::class)->except(['store']);
        Route::apiResource('payments', PaymentController::class);
        Route::post('/reservations/{id}/checkin', [CheckInOutController::class, 'checkIn']);
        Route::post('/reservations/{id}/checkout', [CheckInOutController::class, 'checkOut']);
        Route::get('/dashboard', [DashboardController::class, 'index']);
    });

    // Admin uniquement
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('room-types', RoomTypeController::class)->except(['index', 'show']);
        Route::apiResource('rooms', RoomController::class)->except(['index', 'show']);
        Route::apiResource('services', ServiceController::class);
        Route::apiResource('promotions', PromotionController::class)->except(['store']);
        Route::post('/promotions', [PromotionController::class, 'store']);
        Route::post('/receptionists', [AuthController::class, 'createReceptionist']);
        Route::post('/rooms/{roomId}/images', [RoomImageController::class, 'upload']);
        Route::post('/rooms/{roomId}/images/{imageId}/main', [RoomImageController::class, 'setMain']);
        Route::delete('/rooms/{roomId}/images/{imageId}', [RoomImageController::class, 'destroy']);
    });
});