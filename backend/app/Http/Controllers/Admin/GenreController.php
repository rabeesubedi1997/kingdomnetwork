<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\GenreResource;
use App\Models\Genre;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GenreController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return GenreResource::collection(Genre::orderBy('name')->get());
    }

    public function show(Genre $genre): GenreResource
    {
        return new GenreResource($genre);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:genres,slug',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:100',
        ]);

        $genre = Genre::create($data);

        return response()->json(new GenreResource($genre), 201);
    }

    public function update(Request $request, Genre $genre): GenreResource
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:genres,slug,' . $genre->id,
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:100',
        ]);

        $genre->update($data);

        return new GenreResource($genre);
    }

    public function destroy(Genre $genre): JsonResponse
    {
        $genre->delete();

        return response()->json(null, 204);
    }
}
