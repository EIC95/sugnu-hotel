<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\Service;
use App\Models\Promotion;
use App\Models\RoomAmenity;

class HotelSeeder extends Seeder
{
    public function run(): void
    {
        
        Promotion::create([
            'code'          => 'WELCOME10',
            'description'   => 'Offre de bienvenue -10%',
            'discount'      => 10,
            'is_percentage' => true,
            'starts_at'     => now(),
            'ends_at'       => now()->addMonths(6),
            'is_active'     => true,
        ]);

        
        $standard = RoomType::create([
            'name'          => 'Standard',
            'description'   => 'Chambre standard confortable avec lit double, climatisation et salle de bain privative.',
            'base_price'    => 25000,
            'max_occupancy' => 2,
        ]);

        $deluxe = RoomType::create([
            'name'          => 'Deluxe',
            'description'   => 'Chambre deluxe spacieuse avec vue panoramique, TV écran plat et mini-bar.',
            'base_price'    => 45000,
            'max_occupancy' => 3,
        ]);

        $suite = RoomType::create([
            'name'          => 'Suite',
            'description'   => 'Suite luxueuse avec salon séparé, jacuzzi et service en chambre 24h/24.',
            'base_price'    => 85000,
            'max_occupancy' => 4,
        ]);

        $family = RoomType::create([
            'name'          => 'Familiale',
            'description'   => 'Grande chambre familiale avec deux lits doubles et coin salon.',
            'base_price'    => 55000,
            'max_occupancy' => 6,
        ]);

        
        $rooms = [
            
            ['room_number' => '101', 'room_type_id' => $standard->id, 'floor' => 1, 'price_per_night' => 25000, 'max_occupancy' => 2],
            ['room_number' => '102', 'room_type_id' => $standard->id, 'floor' => 1, 'price_per_night' => 25000, 'max_occupancy' => 2],
            ['room_number' => '103', 'room_type_id' => $standard->id, 'floor' => 1, 'price_per_night' => 25000, 'max_occupancy' => 2],
            ['room_number' => '104', 'room_type_id' => $standard->id, 'floor' => 1, 'price_per_night' => 28000, 'max_occupancy' => 2],
            
            ['room_number' => '201', 'room_type_id' => $deluxe->id,   'floor' => 2, 'price_per_night' => 45000, 'max_occupancy' => 3],
            ['room_number' => '202', 'room_type_id' => $deluxe->id,   'floor' => 2, 'price_per_night' => 45000, 'max_occupancy' => 3],
            ['room_number' => '203', 'room_type_id' => $deluxe->id,   'floor' => 2, 'price_per_night' => 48000, 'max_occupancy' => 3],
            
            ['room_number' => '204', 'room_type_id' => $family->id,   'floor' => 2, 'price_per_night' => 55000, 'max_occupancy' => 6],
            
            ['room_number' => '301', 'room_type_id' => $suite->id,    'floor' => 3, 'price_per_night' => 85000, 'max_occupancy' => 4],
            ['room_number' => '302', 'room_type_id' => $suite->id,    'floor' => 3, 'price_per_night' => 95000, 'max_occupancy' => 4],
        ];

        foreach ($rooms as $room) {
            Room::create(array_merge($room, ['status' => 'available']));
        }

        
        $services = [
            ['name' => 'Petit-déjeuner',     'description' => 'Buffet continental servi de 7h à 10h30.',          'price' => 5000,  'is_active' => true],
            ['name' => 'Déjeuner',           'description' => 'Repas complet au restaurant de l\'hôtel.',          'price' => 8000,  'is_active' => true],
            ['name' => 'Dîner',              'description' => 'Dîner gastronomique servi de 19h à 22h.',           'price' => 12000, 'is_active' => true],
            ['name' => 'Spa & Bien-être',    'description' => 'Accès au spa, hammam et piscine intérieure.',       'price' => 15000, 'is_active' => true],
            ['name' => 'Massage',            'description' => 'Séance de massage relaxant d\'une heure.',          'price' => 20000, 'is_active' => true],
            ['name' => 'Parking sécurisé',   'description' => 'Parking privé surveillé 24h/24.',                   'price' => 2000,  'is_active' => true],
            ['name' => 'Navette aéroport',   'description' => 'Service de navette depuis/vers l\'aéroport.',       'price' => 10000, 'is_active' => true],
            ['name' => 'Blanchisserie',      'description' => 'Service de lavage et repassage, rendu en 24h.',     'price' => 3000,  'is_active' => true],
            ['name' => 'Room Service',       'description' => 'Service en chambre disponible 24h/24.',             'price' => 2500,  'is_active' => true],
            ['name' => 'Salle de réunion',   'description' => 'Location d\'une salle équipée (demi-journée).',     'price' => 50000, 'is_active' => false],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }

        
        $amenitiesMap = [
            '101' => ['WiFi', 'Climatisation', 'TV'],
            '102' => ['WiFi', 'Climatisation', 'TV'],
            '103' => ['WiFi', 'Climatisation'],
            '104' => ['WiFi', 'Climatisation', 'TV', 'Coffre-fort'],
            '201' => ['WiFi', 'Climatisation', 'TV', 'Mini-bar', 'Vue panoramique'],
            '202' => ['WiFi', 'Climatisation', 'TV', 'Mini-bar'],
            '203' => ['WiFi', 'Climatisation', 'TV', 'Mini-bar', 'Balcon'],
            '204' => ['WiFi', 'Climatisation', 'TV', 'Lit bébé disponible', 'Coin salon'],
            '301' => ['WiFi', 'Climatisation', 'TV', 'Jacuzzi', 'Mini-bar', 'Service en chambre', 'Coffre-fort'],
            '302' => ['WiFi', 'Climatisation', 'TV', 'Jacuzzi', 'Mini-bar', 'Service en chambre', 'Coffre-fort', 'Balcon'],
        ];

        foreach ($amenitiesMap as $roomNumber => $amenities) {
            $room = Room::where('room_number', $roomNumber)->first();
            if ($room) {
                foreach ($amenities as $amenity) {
                    RoomAmenity::create(['room_id' => $room->id, 'amenity_name' => $amenity]);
                }
            }
        }

        
        $promotions = [
            [
                'code'          => 'BIENVENUE10',
                'description'   => '10% de réduction pour les nouveaux clients',
                'discount'      => 10,
                'is_percentage' => true,
                'starts_at'     => now()->subDays(5),
                'ends_at'       => now()->addMonths(3),
                'max_uses'      => 100,
                'used_count'    => 3,
                'is_active'     => true,
            ],
            [
                'code'          => 'ETE2025',
                'description'   => '15% de réduction pour les séjours estivaux',
                'discount'      => 15,
                'is_percentage' => true,
                'starts_at'     => now()->subDays(2),
                'ends_at'       => now()->addMonths(2),
                'max_uses'      => null,
                'used_count'    => 0,
                'is_active'     => true,
            ],
            [
                'code'          => 'VIP5000',
                'description'   => '5 000 FCFA de réduction pour les clients VIP',
                'discount'      => 5000,
                'is_percentage' => false,
                'starts_at'     => now()->subMonth(),
                'ends_at'       => now()->addMonth(),
                'max_uses'      => 50,
                'used_count'    => 12,
                'is_active'     => true,
            ],
            [
                'code'          => 'NOEL2024',
                'description'   => 'Offre spéciale fêtes de fin d\'année',
                'discount'      => 20,
                'is_percentage' => true,
                'starts_at'     => now()->subMonths(6),
                'ends_at'       => now()->subMonths(3),
                'max_uses'      => 200,
                'used_count'    => 87,
                'is_active'     => false,
            ],
        ];

        foreach ($promotions as $promo) {
            Promotion::create($promo);
        }

        
        $client1 = User::create([
            'name'     => 'Aminata Diallo',
            'email'    => 'client@sugnuhotel.com',
            'password' => Hash::make('password123'),
            'phone'    => '+221 77 123 45 67',
        ]);
        $client1->assignRole('client');

        $client2 = User::create([
            'name'     => 'Moussa Sow',
            'email'    => 'moussa@test.com',
            'password' => Hash::make('password123'),
            'phone'    => '+221 76 987 65 43',
        ]);
        $client2->assignRole('client');

        $receptionist = User::create([
            'name'     => 'Fatou Ndiaye',
            'email'    => 'receptionist@sugnuhotel.com',
            'password' => Hash::make('password123'),
            'phone'    => '+221 78 555 00 11',
        ]);
        $receptionist->assignRole('receptionist');
    }
}
