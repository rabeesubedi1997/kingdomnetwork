<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index()
    {
        return Page::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug',
            'content' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_image_id' => 'nullable|exists:media,id',
            'schema_type' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        return Page::create($validated);
    }

    public function show(Page $page)
    {
        return $page->load('metaImage');
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:pages,slug,' . $page->id,
            'content' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_image_id' => 'nullable|exists:media,id',
            'schema_type' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $page->update($validated);
        return $page->load('metaImage');
    }

    public function destroy(Page $page)
    {
        $page->delete();
        return response()->noContent();
    }
}
