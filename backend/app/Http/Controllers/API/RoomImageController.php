<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RoomImage;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomImageController extends Controller
{
    private function useCloudinary(): bool
    {
        return !empty(config('filesystems.disks.cloudinary.url'));
    }

    public function upload(Request $request, $roomId)
    {
        $request->validate([
            'images'   => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $room = Room::findOrFail($roomId);
        $uploaded = [];

        foreach ($request->file('images') as $image) {
            if ($this->useCloudinary()) {
                $result = cloudinary()->uploadApi()->upload($image->getRealPath(), [
                    'folder' => 'sugnu-hotel/rooms',
                ]);
                $path = $result['secure_url'];
            } else {
                $path = $image->store('rooms', 'public');
            }

            $roomImage = RoomImage::create([
                'room_id'    => $room->id,
                'image_path' => $path,
                'is_main'    => count($uploaded) === 0 && !$room->images()->exists(),
            ]);

            $uploaded[] = $roomImage;
        }

        return response()->json($uploaded, 201);
    }

    public function setMain($roomId, $imageId)
    {
        $room = Room::findOrFail($roomId);
        $room->images()->update(['is_main' => false]);
        $image = RoomImage::where('room_id', $roomId)->findOrFail($imageId);
        $image->update(['is_main' => true]);

        return response()->json(['message' => 'Image principale définie']);
    }

    public function destroy($roomId, $imageId)
    {
        $image = RoomImage::where('room_id', $roomId)->findOrFail($imageId);

        if ($this->useCloudinary()) {
            // Extraire le public_id depuis l'URL Cloudinary
            // URL: https://res.cloudinary.com/cloud/image/upload/v123/sugnu-hotel/rooms/file.jpg
            if (preg_match('/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/', $image->image_path, $matches)) {
                cloudinary()->uploadApi()->destroy($matches[1]);
            }
        } else {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();

        return response()->json(['message' => 'Image supprimée']);
    }
}