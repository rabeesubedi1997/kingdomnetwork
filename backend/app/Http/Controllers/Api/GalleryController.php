<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Album;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $query = Album::where('is_public', true)
            ->with(['media'])
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $perPage = min($request->integer('per_page', 12), 50);

        return $query->paginate($perPage);
    }

    public function album(string $slug)
    {
        $album = Album::where('slug', $slug)->where('is_public', true)
            ->with(['media'])
            ->firstOrFail();
        return response()->json($album);
    }
}
