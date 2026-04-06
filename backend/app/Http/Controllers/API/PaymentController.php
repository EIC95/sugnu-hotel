<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('reservation')->get();
        return response()->json($payments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'amount'         => 'required|integer',
            'payment_method' => 'required|in:cash,card,mobile_money',
        ]);

        $payment = Payment::create([
            'reservation_id' => $request->reservation_id,
            'amount'         => $request->amount,
            'payment_method' => $request->payment_method,
            'status'         => 'completed',
            'paid_at'        => now(),
        ]);

        return response()->json($payment, 201);
    }

    public function show($id)
    {
        $payment = Payment::with('reservation')->findOrFail($id);
        return response()->json($payment);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        $payment->update($request->all());
        return response()->json($payment);
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();
        return response()->json(['message' => 'Paiement supprimé']);
    }
}