<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::published()
            ->with(['author', 'category', 'tags', 'media'])
            ->orderBy('published_at', 'desc');

        if ($request->filled('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        if ($request->filled('tag')) {
            $query->whereHas('tags', fn($q) => $q->where('slug', $request->tag));
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('excerpt', 'like', '%' . $request->search . '%');
            });
        }

        $perPage = min($request->integer('per_page', 12), 50);

        return $query->paginate($perPage);
    }

    public function featured()
    {
        $posts = Post::published()->where('featured', true)->with(['author', 'category', 'tags', 'media'])->get();
        return response()->json($posts);
    }

    public function byCategory(string $slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        $posts = Post::published()->where('category_id', $category->id)
            ->with(['author', 'category', 'tags', 'media'])
            ->orderBy('published_at', 'desc')
            ->paginate(12);
        return response()->json($posts);
    }

    public function byTag(string $slug)
    {
        $tag = Tag::where('slug', $slug)->firstOrFail();
        $posts = Post::published()->whereHas('tags', fn($q) => $q->where('id', $tag->id))
            ->with(['author', 'category', 'tags', 'media'])
            ->orderBy('published_at', 'desc')
            ->paginate(12);
        return response()->json($posts);
    }

    public function show(string $slug)
    {
        $post = Post::published()
            ->where('slug', $slug)
            ->with(['author', 'category', 'tags', 'media'])
            ->firstOrFail();
        return response()->json($post);
    }
}
