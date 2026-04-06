<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationService extends Model
{
    protected $fillable = ['reservation_id', 'service_id', 'quantity', 'price'];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}