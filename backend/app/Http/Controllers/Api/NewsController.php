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
        $posts = Post::published()->whereHas('tags', fn($q) => $q->where('tags.id', $tag->id))
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

    public function rss()
    {
        $posts = Post::published()
            ->with(['author', 'category', 'media'])
            ->orderBy('published_at', 'desc')
            ->limit(20)
            ->get();

        $siteUrl = url('/');
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">';
        $xml .= '<channel>';
        $xml .= '<title>Kingdom Network News</title>';
        $xml .= '<link>' . $siteUrl . 'news</link>';
        $xml .= '<description>Latest news and updates from Kingdom Network</description>';
        $xml .= '<language>en</language>';
        $xml .= '<atom:link href="' . $siteUrl . 'api/v1/news/rss" rel="self" type="application/rss+xml"/>';

        foreach ($posts as $post) {
            $xml .= '<item>';
            $xml .= '<title><![CDATA[' . $post->title . ']]></title>';
            $xml .= '<link>' . $siteUrl . 'news/' . $post->slug . '</link>';
            $xml .= '<description><![CDATA[' . ($post->excerpt ?? strip_tags(substr($post->content ?? '', 0, 200))) . ']]></description>';
            $xml .= '<pubDate>' . $post->published_at->format('r') . '</pubDate>';
            $xml .= '<guid isPermaLink="true">' . $siteUrl . 'news/' . $post->slug . '</guid>';
            if ($post->category) {
                $xml .= '<category><![CDATA[' . $post->category->name . ']]></category>';
            }
            $imageUrl = $post->getFirstMediaUrl('featured_image');
            if ($imageUrl) {
                $xml .= '<media:content url="' . $imageUrl . '" medium="image"/>';
            }
            $xml .= '</item>';
        }

        $xml .= '</channel></rss>';
        return response($xml, 200)->header('Content-Type', 'application/rss+xml');
    }
}
