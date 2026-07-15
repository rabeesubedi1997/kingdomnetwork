<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Film;
use App\Models\Post;
use App\Models\Person;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $q = $request->input('q');
        if (!$q || strlen(trim($q)) < 2) {
            return response()->json(['data' => []]);
        }

        $term = '%' . $q . '%';

        $films = Film::whereNotNull('published_at')
            ->where(function ($query) use ($term) {
                $query->where('title', 'like', $term)
                    ->orWhere('tagline', 'like', $term)
                    ->orWhere('synopsis', 'like', $term);
            })
            ->get()
            ->map(fn($f) => [
                'type' => 'film',
                'id' => $f->id,
                'title' => $f->title,
                'slug' => $f->slug,
                'url' => '/films/' . $f->slug,
                'image' => $f->poster_url,
                'subtitle' => $f->tagline,
            ]);

        $news = Post::where('status', 'published')
            ->where(function ($query) use ($term) {
                $query->where('title', 'like', $term)
                    ->orWhere('excerpt', 'like', $term)
                    ->orWhere('content', 'like', $term);
            })
            ->get()
            ->map(fn($n) => [
                'type' => 'news',
                'id' => $n->id,
                'title' => $n->title,
                'slug' => $n->slug,
                'url' => '/news/' . $n->slug,
                'image' => $n->featured_image_url,
                'subtitle' => $n->category?->name,
            ]);

        $people = Person::where('is_active', true)
            ->where(function ($query) use ($term) {
                $query->where('name', 'like', $term)
                    ->orWhere('bio', 'like', $term);
            })
            ->get()
            ->map(fn($p) => [
                'type' => 'person',
                'id' => $p->id,
                'title' => $p->name,
                'slug' => $p->slug,
                'url' => '/people/' . $p->slug,
                'image' => $p->photo_url,
                'subtitle' => $p->role,
            ]);

        $team = TeamMember::where('is_active', true)
            ->where(function ($query) use ($term) {
                $query->where('name', 'like', $term)
                    ->orWhere('role', 'like', $term)
                    ->orWhere('bio', 'like', $term);
            })
            ->get()
            ->map(fn($t) => [
                'type' => 'team',
                'id' => $t->id,
                'title' => $t->name,
                'slug' => (string) $t->id,
                'url' => '/team/' . $t->id,
                'image' => $t->photo_url,
                'subtitle' => $t->role,
            ]);

        $results = collect()
            ->merge($films)
            ->merge($news)
            ->merge($people)
            ->merge($team)
            ->take(20)
            ->values();

        return response()->json(['data' => $results, 'total' => $results->count()]);
    }
}
