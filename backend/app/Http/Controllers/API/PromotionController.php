<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index()
    {
        $promotions = Promotion::where('is_active', true)->get();
        return response()->json($promotions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code'      => 'required|string|unique:promotions',
            'discount'  => 'required|integer',
            'starts_at' => 'required|date',
            'ends_at'   => 'required|date|after:starts_at',
        ]);

        $promotion = Promotion::create($request->all());
        return response()->json($promotion, 201);
    }

    public function show($id)
    {
        $promotion = Promotion::findOrFail($id);
        return response()->json($promotion);
    }

    // Vérifier un code promo
    public function checkCode(Request $request)
    {
        $promotion = Promotion::where('code', $request->code)
            ->where('is_active', true)
            ->where('starts_at', '<=', now())
            ->where('ends_at', '>=', now())
            ->first();

        if (!$promotion) {
            return response()->json(['message' => 'Code promo invalide ou expiré'], 404);
        }

        return response()->json($promotion);
    }

    public function update(Request $request, $id)
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->update($request->all());
        return response()->json($promotion);
    }

    public function destroy($id)
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->delete();
        return response()->json(['message' => 'Promotion supprimée']);
    }
}