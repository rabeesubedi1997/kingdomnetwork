<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FilmAward;
use App\Models\Film;
use Illuminate\Http\JsonResponse;

class AwardController extends Controller
{
    public function index(): JsonResponse
    {
        $awards = FilmAward::with('film:id,title,slug,poster')
            ->orderBy('year', 'desc')
            ->orderBy('award_name')
            ->get()
            ->groupBy('film_id')
            ->map(function ($filmAwards, $filmId) {
                $film = $filmAwards->first()->film;
                return [
                    'film_id' => $filmId,
                    'film_title' => $film?->title,
                    'film_slug' => $film?->slug,
                    'total_wins' => $filmAwards->where('result', 'won')->count(),
                    'total_nominations' => $filmAwards->where('result', 'nominated')->count(),
                    'awards' => $filmAwards->map(fn($a) => [
                        'id' => $a->id,
                        'award_name' => $a->award_name,
                        'category' => $a->category,
                        'year' => $a->year,
                        'result' => $a->result,
                        'notes' => $a->notes,
                    ])->values(),
                ];
            })->values();

        return response()->json([
            'total_films' => $awards->count(),
            'total_wins' => FilmAward::where('result', 'won')->count(),
            'total_nominations' => FilmAward::where('result', 'nominated')->count(),
            'data' => $awards,
        ]);
    }
}
