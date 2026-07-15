<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\FilmResource;
use App\Models\Film;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

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
            'poster_url' => 'nullable|string',
            'banner_url' => 'nullable|string',
        ]);

        $film = Film::create($data);

        if ($request->has('genres')) {
            $film->genres()->sync($request->genres);
        }

        $this->syncMedia($film, $request);

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
            'poster_url' => 'nullable|string',
            'banner_url' => 'nullable|string',
        ]);

        $film->update($data);

        if ($request->has('genres')) {
            $film->genres()->sync($request->genres);
        }

        $this->syncMedia($film, $request);

        return new FilmResource($film->load('genres'));
    }

    public function destroy(Film $film): JsonResponse
    {
        $film->delete();

        return response()->json(null, 204);
    }

    private function syncMedia(Film $film, Request $request): void
    {
        $collections = ['poster', 'banner'];

        foreach ($collections as $collection) {
            $url = $request->input("{$collection}_url");

            if (!$url) {
                $film->clearMediaCollection($collection);
                continue;
            }

            $relativePath = str_replace('/storage/', '', $url);
            $fullPath = Storage::disk('public')->path($relativePath);

            if (file_exists($fullPath)) {
                $film->clearMediaCollection($collection);
                $film->addMedia($fullPath)
                    ->preservingOriginal()
                    ->toMediaCollection($collection);
            }
        }
    }
}
