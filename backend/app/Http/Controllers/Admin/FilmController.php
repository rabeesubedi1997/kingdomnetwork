<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\FilmResource;
use App\Models\Film;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FilmController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return FilmResource::collection(Film::with(['genres', 'director', 'producer', 'writer'])->orderByDesc('created_at')->paginate(20));
    }

    public function show(Film $film): FilmResource
    {
        $film->load(['genres', 'director', 'producer', 'writer', 'cinematographer', 'editor', 'composer', 'cast', 'crew', 'awards', 'locations', 'pressKit']);

        return new FilmResource($film);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'slug' => 'required|string|max:255|unique:films,slug',
            'title' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:500',
            'synopsis' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'status' => 'required|string|max:50',
            'release_date' => 'nullable|date',
            'runtime_minutes' => 'nullable|integer',
            'rating' => 'nullable|string|max:20',
            'language' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'budget' => 'nullable|integer',
            'box_office' => 'nullable|integer',
            'trailer_url' => 'nullable|string|max:500',
            'trailer_embed_code' => 'nullable|string',
            'director_id' => 'nullable|exists:people,id',
            'producer_id' => 'nullable|exists:people,id',
            'writer_id' => 'nullable|exists:people,id',
            'cinematographer_id' => 'nullable|exists:people,id',
            'editor_id' => 'nullable|exists:people,id',
            'composer_id' => 'nullable|exists:people,id',
            'is_featured' => 'boolean',
            'sort_order' => 'nullable|integer',
            'published_at' => 'nullable|date',
            'genres' => 'nullable|array',
            'genres.*' => 'exists:genres,id',
        ]);

        $film = Film::create($data);

        if ($request->has('genres')) {
            $film->genres()->sync($request->genres);
        }

        return response()->json(new FilmResource($film->load('genres')), 201);
    }

    public function update(Request $request, Film $film): FilmResource
    {
        $data = $request->validate([
            'slug' => 'required|string|max:255|unique:films,slug,' . $film->id,
            'title' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:500',
            'synopsis' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'status' => 'required|string|max:50',
            'release_date' => 'nullable|date',
            'runtime_minutes' => 'nullable|integer',
            'rating' => 'nullable|string|max:20',
            'language' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'budget' => 'nullable|integer',
            'box_office' => 'nullable|integer',
            'trailer_url' => 'nullable|string|max:500',
            'trailer_embed_code' => 'nullable|string',
            'director_id' => 'nullable|exists:people,id',
            'producer_id' => 'nullable|exists:people,id',
            'writer_id' => 'nullable|exists:people,id',
            'cinematographer_id' => 'nullable|exists:people,id',
            'editor_id' => 'nullable|exists:people,id',
            'composer_id' => 'nullable|exists:people,id',
            'is_featured' => 'boolean',
            'sort_order' => 'nullable|integer',
            'published_at' => 'nullable|date',
            'genres' => 'nullable|array',
            'genres.*' => 'exists:genres,id',
        ]);

        $film->update($data);

        if ($request->has('genres')) {
            $film->genres()->sync($request->genres);
        }

        return new FilmResource($film->load('genres'));
    }

    public function destroy(Film $film): JsonResponse
    {
        $film->delete();

        return response()->json(null, 204);
    }
}
