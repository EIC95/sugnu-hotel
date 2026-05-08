<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade'); 
            $table->integer('amount');           
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->enum('payment_method', ['cash', 'card', 'mobile_money'])->default('cash');
            $table->string('transaction_id')->nullable(); 
            $table->timestamp('paid_at')->nullable();     
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
