<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = ['name', 'description', 'price', 'is_active'];

    public function reservations()
    {
        return $this->belongsToMany(Reservation::class, 'reservation_services')
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }
}