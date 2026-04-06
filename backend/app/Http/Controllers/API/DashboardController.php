<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Payment;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();

        $arrivalsToday = Reservation::where('check_in_date', $today)
            ->where('status', 'confirmed')
            ->with(['user', 'room'])
            ->get();

        $departuresToday = Reservation::where('check_out_date', $today)
            ->where('status', 'checked_in')
            ->with(['user', 'room'])
            ->get();

        $totalRooms     = Room::count();
        $occupiedRooms  = Room::where('status', 'occupied')->count();
        $occupancyRate  = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100) : 0;

        $totalRevenue = Payment::where('status', 'completed')->sum('amount');

        $pendingReservations = Reservation::where('status', 'pending')->count();

        return response()->json([
            'arrivals_today'      => $arrivalsToday,
            'departures_today'    => $departuresToday,
            'total_rooms'         => $totalRooms,
            'occupied_rooms'      => $occupiedRooms,
            'occupancy_rate'      => $occupancyRate . '%',
            'total_revenue'       => $totalRevenue,
            'pending_reservations'=> $pendingReservations,
        ]);
    }
}