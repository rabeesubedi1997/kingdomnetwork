<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PostResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return PostResource::collection(Post::with(['author', 'category', 'tags'])->orderByDesc('created_at')->paginate(20));
    }

    public function show(Post $post): PostResource
    {
        $post->load(['author', 'category', 'tags']);

        return new PostResource($post);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'slug' => 'required|string|max:255|unique:posts,slug',
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'author_id' => 'nullable|exists:users,id',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'required|string|max:50',
            'featured' => 'boolean',
            'reading_time' => 'nullable|integer',
            'published_at' => 'nullable|date',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'schema_type' => 'nullable|string|max:50',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $post = Post::create($data);

        if ($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }

        return response()->json(new PostResource($post->load(['author', 'category', 'tags'])), 201);
    }

    public function update(Request $request, Post $post): PostResource
    {
        $data = $request->validate([
            'slug' => 'required|string|max:255|unique:posts,slug,' . $post->id,
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'author_id' => 'nullable|exists:users,id',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'required|string|max:50',
            'featured' => 'boolean',
            'reading_time' => 'nullable|integer',
            'published_at' => 'nullable|date',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'schema_type' => 'nullable|string|max:50',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $post->update($data);

        if ($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }

        return new PostResource($post->load(['author', 'category', 'tags']));
    }

    public function destroy(Post $post): JsonResponse
    {
        $post->delete();

        return response()->json(null, 204);
    }
}
