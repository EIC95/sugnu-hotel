<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class RoomImage extends Model
{
    protected $fillable = ['room_id', 'image_path', 'is_main'];
    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): string
    {
        // URL Cloudinary déjà complète
        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
        }
        // Stockage local : APP_URL + /storage/ + chemin relatif
        return asset('storage/' . $this->image_path);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}