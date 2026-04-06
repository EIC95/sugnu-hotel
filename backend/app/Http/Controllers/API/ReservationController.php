<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Mail\ReservationConfirmed;
use App\Mail\ReservationCancelled;
use App\Mail\ReservationModified;
use Illuminate\Support\Facades\Mail;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::with(['user', 'room', 'services'])->get();
        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_id'          => 'required|exists:rooms,id',
            'check_in_date'    => 'required|date|after:today',
            'check_out_date'   => 'required|date|after:check_in_date',
            'number_of_adults' => 'required|integer|min:1',
        ]);

        $conflict = Reservation::where('room_id', $request->room_id)
            ->whereNotIn('status', ['cancelled'])
            ->where(function ($query) use ($request) {
                $query->where('check_in_date', '<', $request->check_out_date)
                    ->where('check_out_date', '>', $request->check_in_date);
            })->exists();

        if ($conflict) {
            return response()->json(['message' => 'Chambre non disponible pour ces dates'], 409);
        }

        $room = Room::findOrFail($request->room_id);
        $nights = now()->parse($request->check_in_date)->diffInDays($request->check_out_date);
        $total = $room->price_per_night * $nights;

        $reservation = Reservation::create([
            'reservation_number' => 'RES-' . strtoupper(Str::random(8)),
            'user_id'            => $request->user()->id,
            'room_id'            => $request->room_id,
            'check_in_date'      => $request->check_in_date,
            'check_out_date'     => $request->check_out_date,
            'number_of_adults'   => $request->number_of_adults,
            'number_of_children' => $request->number_of_children ?? 0,
            'total_price'        => $total,
            'special_requests'   => $request->special_requests,
        ]);

        if ($request->services) {
            foreach ($request->services as $service) {
                $reservation->services()->attach($service['id'], [
                    'quantity' => $service['quantity'],
                    'price'    => $service['price'],
                ]);
            }
        }

        Mail::to($reservation->user->email)->send(new ReservationConfirmed($reservation->load('user', 'room')));

        return response()->json($reservation->load(['room', 'services']), 201);
    }

    public function show($id)
    {
        $reservation = Reservation::with(['user', 'room', 'services', 'payment'])->findOrFail($id);
        return response()->json($reservation);
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update($request->all());
        Mail::to($reservation->user->email)->send(new ReservationModified($reservation->load('user', 'room')));
        return response()->json($reservation);
    }

    public function destroy($id)
    {
        $reservation = Reservation::with(['user', 'room'])->findOrFail($id);
        $reservation->update(['status' => 'cancelled']);
        Mail::to($reservation->user->email)->send(new ReservationCancelled($reservation));
        return response()->json(['message' => 'Réservation annulée']);
    }
}