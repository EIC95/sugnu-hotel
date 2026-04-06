<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\Service;

class HotelSeeder extends Seeder
{
    public function run(): void
    {
        $standard = RoomType::create([
            'name'          => 'Standard',
            'description'   => 'Chambre standard confortable',
            'base_price'    => 25000,
            'max_occupancy' => 2,
        ]);

        $deluxe = RoomType::create([
            'name'          => 'Deluxe',
            'description'   => 'Chambre deluxe avec vue',
            'base_price'    => 45000,
            'max_occupancy' => 3,
        ]);

        $suite = RoomType::create([
            'name'          => 'Suite',
            'description'   => 'Suite présidentielle',
            'base_price'    => 85000,
            'max_occupancy' => 4,
        ]);

        Room::create(['room_number' => '101', 'room_type_id' => $standard->id, 'floor' => 1, 'price_per_night' => 25000, 'max_occupancy' => 2]);
        Room::create(['room_number' => '102', 'room_type_id' => $standard->id, 'floor' => 1, 'price_per_night' => 25000, 'max_occupancy' => 2]);
        Room::create(['room_number' => '201', 'room_type_id' => $deluxe->id,   'floor' => 2, 'price_per_night' => 45000, 'max_occupancy' => 3]);
        Room::create(['room_number' => '202', 'room_type_id' => $deluxe->id,   'floor' => 2, 'price_per_night' => 45000, 'max_occupancy' => 3]);
        Room::create(['room_number' => '301', 'room_type_id' => $suite->id,    'floor' => 3, 'price_per_night' => 85000, 'max_occupancy' => 4]);

        Service::create(['name' => 'Petit-déjeuner', 'price' => 5000]);
        Service::create(['name' => 'Parking',        'price' => 2000]);
        Service::create(['name' => 'Spa',            'price' => 15000]);
        Service::create(['name' => 'Navette',        'price' => 8000]);
    }
}