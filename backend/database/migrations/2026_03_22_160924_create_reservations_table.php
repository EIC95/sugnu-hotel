<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('reservation_number')->unique(); 
            $table->foreignId('user_id')->constrained()->onDelete('cascade');  
            $table->foreignId('room_id')->constrained()->onDelete('cascade');  
            $table->date('check_in_date');           
            $table->date('check_out_date');          
            $table->integer('number_of_adults');     
            $table->integer('number_of_children')->default(0); 
            $table->integer('total_price');          
            $table->enum('status', ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'])->default('pending');
            $table->text('special_requests')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
