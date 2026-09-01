<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Film;
use App\Models\Genre;
use App\Models\Person;
use Illuminate\Http\Request;

class FilmController extends Controller
{
    public function index(Request $request)
    {
        $query = Film::published()
            ->with(['director', 'genres', 'media', 'awards'])
            ->orderBy('sort_order')
            ->orderByDesc('published_at');

        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        if ($request->filled('genre')) {
            $query->whereHas('genres', function ($q) use ($request) {
                $q->where('slug', $request->genre);
            });
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('synopsis', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('year')) {
            $query->whereYear('release_date', $request->year);
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        $perPage = min($request->integer('per_page', 12), 50);

        return $query->paginate($perPage);
    }

    public function featured()
    {
        $films = Film::published()->featured()->with(['director', 'genres', 'media', 'awards'])->paginate(12);
        return response()->json($films);
    }

    public function byStatus(string $status)
    {
        $films = Film::published()->byStatus($status)->with(['director', 'genres', 'media', 'awards'])->paginate(12);
        return response()->json($films);
    }

    public function show(string $slug)
    {
        $film = Film::published()
            ->where('slug', $slug)
            ->with([
                'director',
                'producer',
                'writer',
                'cinematographer',
                'editor',
                'composer',
                'genres',
                'cast.person',
                'crew.person',
                'awards',
                'locations',
                'gallery.media',
                'pressKit',
                'screenings',
            ])
            ->firstOrFail();

        return response()->json($film);
    }

    public function gallery(string $slug)
    {
        $film = Film::published()->where('slug', $slug)->firstOrFail();
        return response()->json($film->gallery_images);
    }

    public function pressKit(string $slug)
    {
        $film = Film::published()->where('slug', $slug)->firstOrFail();
        return response()->json($film->pressKit);
    }

    public function screenings(string $slug)
    {
        $film = Film::published()->where('slug', $slug)->firstOrFail();
        return response()->json($film->screenings);
    }
}
