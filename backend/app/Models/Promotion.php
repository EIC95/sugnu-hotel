<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $fillable = ['code', 'description', 'discount', 'is_percentage', 'max_uses', 'used_count', 'starts_at', 'ends_at', 'is_active'];
}