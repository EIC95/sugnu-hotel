<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Mail\ReservationConfirmed;
use App\Mail\ReservationCancelled;
use App\Mail\ReservationModified;
use Illuminate\Support\Facades\Mail;
use App\Models\Promotion;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::with(['user', 'room', 'services'])->get();
        return response()->json($reservations);
    }

    public function myReservations(Request $request)
    {
        $reservations = Reservation::with(['room.roomType', 'room.images', 'room.amenities', 'services'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_id'          => 'required|exists:rooms,id',
            'check_in_date'    => 'required|date|after_or_equal:today',
            'check_out_date'   => 'required|date|after:check_in_date',
            'number_of_adults' => 'required|integer|min:1',
            'promo_code'       => 'nullable|string'
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
        
        // Calcul du sous-total (chambre + services)
        $subtotal_room = $room->price_per_night * $nights;
        $subtotal_services = 0;
        
        $services_to_attach = [];
        if ($request->services) {
            foreach ($request->services as $svc_req) {
                $service = Service::find($svc_req['id']);
                if ($service && $service->is_active) {
                    $qty = $svc_req['quantity'] ?? 1;
                    $subtotal_services += ($service->price * $qty);
                    $services_to_attach[$service->id] = [
                        'quantity' => $qty,
                        'price'    => $service->price,
                    ];
                }
            }
        }
        
        $total = $subtotal_room + $subtotal_services;
        $discount_amount = 0;

        // Application du code promo
        if ($request->promo_code) {
            $promotion = Promotion::where('code', $request->promo_code)
                ->where('is_active', true)
                ->where('starts_at', '<=', now())
                ->where('ends_at', '>=', now())
                ->first();

            if ($promotion) {
                if ($promotion->max_uses && $promotion->used_count >= $promotion->max_uses) {
                    // Optionnel: on pourrait retourner une erreur, mais ici on ignore juste la promo
                } else {
                    if ($promotion->is_percentage) {
                        $discount_amount = ($total * $promotion->discount) / 100;
                    } else {
                        $discount_amount = $promotion->discount;
                    }
                    $total = max(0, $total - $discount_amount);
                    $promotion->increment('used_count');
                }
            }
        }

        $reservation = Reservation::create([
            'reservation_number' => 'RES-' . strtoupper(Str::random(8)),
            'user_id'            => $request->user()->id,
            'room_id'            => $request->room_id,
            'check_in_date'      => $request->check_in_date,
            'check_out_date'     => $request->check_out_date,
            'number_of_adults'   => $request->number_of_adults,
            'number_of_children' => $request->number_of_children ?? 0,
            'total_price'        => $total,
            'discount_amount'    => $discount_amount,
            'promo_code'         => $request->promo_code,
            'special_requests'   => $request->special_requests,
        ]);

        if (!empty($services_to_attach)) {
            $reservation->services()->attach($services_to_attach);
        }

        Mail::to($reservation->user->email)->send(new ReservationConfirmed($reservation->load('user', 'room')));

        return response()->json($reservation->load(['room', 'services']), 201);
    }

    public function show($id)
    {
        $reservation = Reservation::with([
            'user', 
            'room.roomType', 
            'room.images', 
            'room.amenities', 
            'services', 
            'payment'
        ])->findOrFail($id);
        
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
        $reservation = Reservation::findOrFail($id);

        // Sécurité : Un client ne peut annuler que sa réservation
        if (auth()->user()->role === 'client' && $reservation->user_id !== auth()->id()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $reservation->update(['status' => 'cancelled']);
        
        try {
            Mail::to($reservation->user->email)->send(new ReservationCancelled($reservation->load('user', 'room')));
        } catch (\Exception $e) {
            // Ignorer si l'envoi de mail échoue (ex: config SMTP manquante en dev)
        }

        return response()->json(['message' => 'Réservation annulée avec succès']);
    }
}