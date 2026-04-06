<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use App\Models\Reservation;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::with(['roomType', 'images', 'amenities'])->get();
        return response()->json($rooms);
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_number'    => 'required|string|unique:rooms',
            'room_type_id'   => 'required|exists:room_types,id',
            'floor'          => 'required|integer',
            'price_per_night'=> 'required|integer',
            'max_occupancy'  => 'required|integer',
        ]);

        $room = Room::create($request->all());
        return response()->json($room, 201);
    }

    public function show($id)
    {
        $room = Room::with(['roomType', 'images', 'amenities', 'reservations'])->findOrFail($id);
        return response()->json($room);
    }

    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);
        $room->update($request->all());
        return response()->json($room);
    }

    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();
        return response()->json(['message' => 'Chambre supprimée']);
    }

    public function available(Request $request)
    {
        $request->validate([
            'check_in_date'    => 'required|date|after:today',
            'check_out_date'   => 'required|date|after:check_in_date',
            'number_of_adults' => 'required|integer|min:1',
        ]);

        $reservedRoomIds = Reservation::where('status', '!=', 'cancelled')
            ->where(function ($query) use ($request) {
                $query->whereBetween('check_in_date', [$request->check_in_date, $request->check_out_date])
                    ->orWhereBetween('check_out_date', [$request->check_in_date, $request->check_out_date])
                    ->orWhere(function ($query) use ($request) {
                        $query->where('check_in_date', '<=', $request->check_in_date)
                                ->where('check_out_date', '>=', $request->check_out_date);
                    });
            })->pluck('room_id');

        $rooms = Room::with(['roomType', 'images', 'amenities'])
            ->whereNotIn('id', $reservedRoomIds)
            ->where('status', 'available')
            ->where('max_occupancy', '>=', $request->number_of_adults + ($request->number_of_children ?? 0))
            ->get();

        return response()->json($rooms);
    }
}