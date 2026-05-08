<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_number')->unique(); 
            $table->foreignId('room_type_id')->constrained()->onDelete('cascade'); 
            $table->integer('floor');                
            $table->integer('price_per_night');      
            $table->integer('max_occupancy');        
            $table->enum('status', ['available', 'occupied', 'maintenance', 'out_of_service'])->default('available');
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
