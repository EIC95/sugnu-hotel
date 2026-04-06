<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use Illuminate\Http\Request;

class RoomTypeController extends Controller
{
    public function index()
    {
        $roomTypes = RoomType::all();
        return response()->json($roomTypes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'          => 'required|string',
            'description'   => 'required|string',
            'base_price'    => 'required|integer',
            'max_occupancy' => 'required|integer',
        ]);

        $roomType = RoomType::create($request->all());
        return response()->json($roomType, 201);
    }

    public function show($id)
    {
        $roomType = RoomType::with('rooms')->findOrFail($id);
        return response()->json($roomType);
    }

    public function update(Request $request, $id)
    {
        $roomType = RoomType::findOrFail($id);
        $roomType->update($request->all());
        return response()->json($roomType);
    }

    public function destroy($id)
    {
        $roomType = RoomType::findOrFail($id);
        $roomType->delete();
        return response()->json(['message' => 'Type de chambre supprimé']);
    }
}