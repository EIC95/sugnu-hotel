<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Http\Request;

class CheckInOutController extends Controller
{
    public function checkIn($id)
    {
        $reservation = Reservation::findOrFail($id);

        if ($reservation->status !== 'confirmed') {
            return response()->json(['message' => 'La réservation doit être confirmée pour faire le check-in'], 400);
        }

        $reservation->update(['status' => 'checked_in']);
        $reservation->room->update(['status' => 'occupied']);

        return response()->json(['message' => 'Check-in effectué avec succès', 'reservation' => $reservation]);
    }

    public function checkOut($id)
    {
        $reservation = Reservation::findOrFail($id);

        if ($reservation->status !== 'checked_in') {
            return response()->json(['message' => 'Le client doit être enregistré pour faire le check-out'], 400);
        }

        $reservation->update(['status' => 'checked_out']);
        $reservation->room->update(['status' => 'available']);

        return response()->json(['message' => 'Check-out effectué avec succès', 'reservation' => $reservation]);
    }
}