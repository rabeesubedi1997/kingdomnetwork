<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Person;
use Illuminate\Http\JsonResponse;

class PeopleController extends Controller
{
    public function index(): JsonResponse
    {
        $people = Person::where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'role' => $p->role,
                'photo_url' => $p->photo_url,
                'bio' => $p->bio,
            ]);

        return response()->json(['data' => $people]);
    }

    public function show(string $slug): JsonResponse
    {
        $person = Person::where('slug', $slug)->where('is_active', true)->firstOrFail();

        $films = collect();

        foreach ($person->directedFilms as $f) {
            $films->push(['film_id' => $f->id, 'title' => $f->title, 'slug' => $f->slug, 'role' => 'Director', 'poster_url' => $f->poster_url]);
        }
        foreach ($person->producedFilms as $f) {
            $films->push(['film_id' => $f->id, 'title' => $f->title, 'slug' => $f->slug, 'role' => 'Producer', 'poster_url' => $f->poster_url]);
        }
        foreach ($person->writtenFilms as $f) {
            $films->push(['film_id' => $f->id, 'title' => $f->title, 'slug' => $f->slug, 'role' => 'Writer', 'poster_url' => $f->poster_url]);
        }
        foreach ($person->castRoles as $cast) {
            if ($cast->film) {
                $films->push(['film_id' => $cast->film_id, 'title' => $cast->film->title, 'slug' => $cast->film->slug, 'role' => $cast->role_name ?: 'Actor', 'character_name' => $cast->character_name, 'poster_url' => $cast->film->poster_url]);
            }
        }
        foreach ($person->crewRoles as $crew) {
            if ($crew->film) {
                $films->push(['film_id' => $crew->film_id, 'title' => $crew->film->title, 'slug' => $crew->film->slug, 'role' => $crew->role, 'department' => $crew->department, 'poster_url' => $crew->film->poster_url]);
            }
        }

        $films = $films->unique('film_id')->sortByDesc(function ($f) {
            $film = \App\Models\Film::find($f['film_id']);
            return $film?->release_date ?? $film?->created_at;
        })->values();

        return response()->json([
            'id' => $person->id,
            'name' => $person->name,
            'slug' => $person->slug,
            'role' => $person->role,
            'bio' => $person->bio,
            'photo_url' => $person->photo_url,
            'birth_date' => $person->birth_date?->toDateString(),
            'birth_place' => $person->birth_place,
            'imdb_url' => $person->imdb_url,
            'social_links' => $person->social_links,
            'films' => $films,
        ]);
    }
}
