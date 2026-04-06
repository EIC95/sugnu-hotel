<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RoomImage;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomImageController extends Controller
{
    public function upload(Request $request, $roomId)
    {
        $request->validate([
            'images'   => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $room = Room::findOrFail($roomId);
        $uploaded = [];

        foreach ($request->file('images') as $image) {
            $path = $image->store('rooms', 'public');

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
        \Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return response()->json(['message' => 'Image supprimée']);
    }
}