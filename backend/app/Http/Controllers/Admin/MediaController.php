<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = Media::query();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('file_name', 'like', "%{$request->search}%");
            });
        }

        if ($request->type) {
            $type = $request->type === 'image' ? 'image' : ($request->type === 'video' ? 'video' : null);
            if ($type) {
                $query->where('mime_type', 'like', "$type/%");
            }
        }

        $media = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 24);

        $media->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'file_name' => $item->file_name,
                'mime_type' => $item->mime_type,
                'size' => $item->size,
                'url' => $item->url,
                'thumb' => $item->thumb,
                'created_at' => $item->created_at,
                'is_image' => Str::startsWith($item->mime_type, 'image/'),
                'is_video' => Str::startsWith($item->mime_type, 'video/'),
            ];
        });

        return response()->json($media);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,webp,svg,mp4,webm,avi,mov|max:102400',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $filename = time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();

        $media = Media::create([
            'name' => pathinfo($originalName, PATHINFO_FILENAME),
            'file_name' => $filename,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'disk' => 'public',
            'conversions_disk' => 'public',
            'collection_name' => 'media_library',
            'model_type' => 'App\Models\Media',
            'model_id' => 0,
            'manipulations' => [],
            'custom_properties' => [],
            'generated_conversions' => [],
            'responsive_images' => [],
        ]);

        $path = $file->storeAs((string)$media->id, $filename, 'public');

        return response()->json([
            'id' => $media->id,
            'name' => $media->name,
            'file_name' => $media->file_name,
            'mime_type' => $media->mime_type,
            'size' => $media->size,
            'url' => '/storage/' . $path,
            'thumb' => '/storage/' . $path,
            'is_image' => Str::startsWith($media->mime_type, 'image/'),
            'is_video' => Str::startsWith($media->mime_type, 'video/'),
        ], 201);
    }

    public function uploadMultiple(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'required|file|mimes:jpg,jpeg,png,gif,webp,svg,mp4,webm,avi,mov|max:102400',
        ]);

        $uploaded = [];

        foreach ($request->file('files') as $file) {
            $originalName = $file->getClientOriginalName();
            $filename = time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();

            $media = Media::create([
                'name' => pathinfo($originalName, PATHINFO_FILENAME),
                'file_name' => $filename,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'disk' => 'public',
                'conversions_disk' => 'public',
                'collection_name' => 'media_library',
                'model_type' => 'App\Models\Media',
                'model_id' => 0,
                'manipulations' => [],
                'custom_properties' => [],
                'generated_conversions' => [],
                'responsive_images' => [],
            ]);

            $path = $file->storeAs((string)$media->id, $filename, 'public');

            $uploaded[] = [
                'id' => $media->id,
                'name' => $media->name,
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'size' => $media->size,
                'url' => '/storage/' . $path,
                'thumb' => '/storage/' . $path,
                'is_image' => Str::startsWith($media->mime_type, 'image/'),
                'is_video' => Str::startsWith($media->mime_type, 'video/'),
            ];
        }

        return response()->json($uploaded, 201);
    }

    public function destroy($id)
    {
        $media = Media::findOrFail($id);
        Storage::disk('public')->delete($media->id . '/' . $media->file_name);
        $media->delete();

        return response()->json(['message' => 'Media deleted']);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'integer|exists:media,id']);
        $items = Media::whereIn('id', $request->ids)->get();
        foreach ($items as $media) {
            Storage::disk('public')->delete($media->id . '/' . $media->file_name);
        }
        Media::whereIn('id', $request->ids)->delete();
        return response()->json(['message' => 'Media deleted']);
    }
}
