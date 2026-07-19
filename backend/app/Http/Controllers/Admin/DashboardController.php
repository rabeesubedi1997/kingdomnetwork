<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Film;
use App\Models\Genre;
use App\Models\Job;
use App\Models\Person;
use App\Models\Post;
use App\Models\PressKit;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'films' => Film::count(),
            'posts' => Post::count(),
            'jobs' => Job::count(),
            'albums' => Album::count(),
            'team_members' => TeamMember::count(),
            'people' => Person::count(),
            'press_kits' => PressKit::count(),
            'genres' => Genre::count(),
        ]);
    }
}
