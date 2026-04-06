<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['reservation_id', 'amount', 'status', 'payment_method', 'transaction_id', 'paid_at'];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}