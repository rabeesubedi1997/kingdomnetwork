<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Http\Resources\TeamMemberResource;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function show()
    {
        $team = TeamMember::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'role' => $m->role,
                'bio' => $m->bio,
                'photo_url' => $m->photo_url,
                'email' => $m->email,
                'phone' => $m->phone,
                'birth_date' => $m->birth_date?->toDateString(),
                'birth_place' => $m->birth_place,
                'imdb_url' => $m->imdb_url,
                'instagram_url' => $m->instagram_url,
                'twitter_url' => $m->twitter_url,
                'linkedin_url' => $m->linkedin_url,
                'website_url' => $m->website_url,
                'social_links' => $m->social_links,
                'sort_order' => $m->sort_order,
            ]);

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

    public function team(int $id)
    {
        $member = TeamMember::where('is_active', true)->findOrFail($id);

        return response()->json([
            'id' => $member->id,
            'name' => $member->name,
            'role' => $member->role,
            'bio' => $member->bio,
            'photo_url' => $member->photo_url,
            'email' => $member->email,
            'phone' => $member->phone,
            'birth_date' => $member->birth_date?->toDateString(),
            'birth_place' => $member->birth_place,
            'imdb_url' => $member->imdb_url,
            'instagram_url' => $member->instagram_url,
            'twitter_url' => $member->twitter_url,
            'linkedin_url' => $member->linkedin_url,
            'website_url' => $member->website_url,
            'social_links' => $member->social_links,
            'sort_order' => $member->sort_order,
        ]);
    }
}