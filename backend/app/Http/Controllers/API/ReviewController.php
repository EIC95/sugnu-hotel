<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with(['user', 'reservation'])->get();
        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'rating'         => 'required|integer|min:1|max:5',
            'comment'        => 'nullable|string',
        ]);

        $review = Review::create([
            'user_id'        => $request->user()->id,
            'reservation_id' => $request->reservation_id,
            'rating'         => $request->rating,
            'comment'        => $request->comment,
        ]);

        return response()->json($review, 201);
    }

    public function show($id)
    {
        $review = Review::with(['user', 'reservation'])->findOrFail($id);
        return response()->json($review);
    }

    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        $review->update($request->all());
        return response()->json($review);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();
        return response()->json(['message' => 'Avis supprimé']);
    }
}