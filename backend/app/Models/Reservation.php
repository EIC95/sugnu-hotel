<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = ['reservation_number', 'user_id', 'room_id', 'check_in_date', 'check_out_date', 'number_of_adults', 'number_of_children', 'total_price', 'status', 'special_requests'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'reservation_services')
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}