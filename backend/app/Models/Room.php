<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = ['room_number', 'room_type_id', 'floor', 'price_per_night', 'max_occupancy', 'status'];

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function images()
    {
        return $this->hasMany(RoomImage::class);
    }
    public function amenities()
    {
        return $this->hasMany(RoomAmenity::class);
    }
}