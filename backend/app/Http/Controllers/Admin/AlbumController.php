<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AlbumResource;
use App\Models\Album;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AlbumController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return AlbumResource::collection(Album::with('film')->orderByDesc('created_at')->paginate(20));
    }

    public function show(Album $album): AlbumResource
    {
        $album->load(['film', 'event', 'images']);

        return new AlbumResource($album);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'slug' => 'required|string|max:255|unique:albums,slug',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'film_id' => 'nullable|exists:films,id',
            'event_id' => 'nullable|exists:events,id',
            'is_public' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $album = Album::create($data);

        return response()->json(new AlbumResource($album), 201);
    }

    public function update(Request $request, Album $album): AlbumResource
    {
        $data = $request->validate([
            'slug' => 'required|string|max:255|unique:albums,slug,' . $album->id,
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'film_id' => 'nullable|exists:films,id',
            'event_id' => 'nullable|exists:events,id',
            'is_public' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $album->update($data);

        return new AlbumResource($album);
    }

    public function destroy(Album $album): JsonResponse
    {
        $album->delete();

        return response()->json(null, 204);
    }
}
