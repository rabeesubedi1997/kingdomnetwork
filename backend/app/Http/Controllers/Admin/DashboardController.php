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
use App\Models\ContactSubmission;
use App\Models\JobApplication;
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

    public function notifications(): JsonResponse
    {
        $recentFilms = Film::whereNotNull('published_at')->latest()->take(3)->get()->map(fn($f) => [
            'type' => 'film_published',
            'message' => "Film published: {$f->title}",
            'link' => "/admin/films/{$f->id}",
            'time' => $f->published_at?->diffForHumans() ?? $f->created_at->diffForHumans(),
        ]);

        $recentPosts = Post::where('status', 'published')->latest()->take(3)->get()->map(fn($p) => [
            'type' => 'news_published',
            'message' => "News published: {$p->title}",
            'link' => "/admin/news/{$p->id}",
            'time' => $p->published_at?->diffForHumans() ?? $p->created_at->diffForHumans(),
        ]);

        $contactSubmissions = ContactSubmission::where('status', 'pending')->latest()->take(3)->get()->map(fn($c) => [
            'type' => 'contact_message',
            'message' => "New contact message from {$c->name}",
            'link' => '/admin/contact-submissions',
            'time' => $c->created_at->diffForHumans(),
        ]);

        $jobApplications = JobApplication::where('status', 'pending')->latest()->take(3)->get()->map(fn($j) => [
            'type' => 'job_application',
            'message' => "New job application from {$j->name}",
            'link' => '/admin/job-applications',
            'time' => $j->created_at->diffForHumans(),
        ]);

        $notifications = collect()
            ->merge($contactSubmissions)
            ->merge($jobApplications)
            ->merge($recentFilms)
            ->merge($recentPosts)
            ->sortByDesc(fn($n) => $n['time'])
            ->take(10)
            ->values();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $notifications->count(),
        ]);
    }
}
