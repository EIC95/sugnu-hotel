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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();    
            $table->text('description')->nullable();
            $table->integer('discount');         
            $table->boolean('is_percentage')->default(false); 
            $table->integer('max_uses')->nullable();          
            $table->integer('used_count')->default(0);        
            $table->date('starts_at');           
            $table->date('ends_at');             
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }   

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
