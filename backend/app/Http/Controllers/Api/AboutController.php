<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function show()
    {
        $team = TeamMember::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'role', 'bio', 'photo_id', 'social_links', 'sort_order']);

        return response()->json([
            'mission' => config('kingdom.brand.mission') ?? 'To revolutionize the Nepali and global entertainment industry...',
            'vision' => config('kingdom.brand.vision') ?? 'To be recognized as a global leader in film production...',
            'values' => [
                'Creativity' => 'Bringing imagination to reality',
                'Collaboration' => 'Working together with artists, talents & brands',
                'Innovation' => 'Adapting new trends & technology',
                'Excellence' => 'Maintaining world-class production standards',
                'Passion' => 'Storytelling that touches hearts',
            ],
            'team' => $team,
            'journey' => [
                '2024' => [
                    'title' => 'Pujar Sarki',
                    'status' => 'Released',
                    'description' => 'One of the highest-grossing and most critically acclaimed Nepali films.',
                    'awards' => ['National Film Award 2081', 'Nepal International Film Festival (NIFF) 2025', 'Nepal Rural Film Award (NERUFF)'],
                ],
                '2025' => [
                    'title' => 'Fracture',
                    'status' => 'Post-Production',
                    'description' => 'Adventurous action directed by Emmy-winning filmmaker Ryan Travis.',
                    'awards' => [],
                ],
                '2026' => [
                    'title' => 'Song of My Grandmother',
                    'status' => 'Pre-Production',
                    'description' => 'Stories deeply connecting with everyday lives of Nepali people.',
                    'awards' => [],
                ],
                '2028' => [
                    'title' => 'A Millionaire (6 Crore)',
                    'status' => 'Future Project',
                    'description' => 'Groundbreaking cinema with authentic, relatable stories.',
                    'awards' => [],
                ],
                '2027' => [
                    'title' => 'Nau Lakh Tara',
                    'status' => 'Future Project',
                    'description' => 'Upcoming exploration of stories connecting with Nepali people.',
                    'awards' => [],
                ],
            ],
        ]);
    }
}