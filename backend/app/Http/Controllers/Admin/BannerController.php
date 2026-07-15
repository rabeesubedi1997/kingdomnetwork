<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index()
    {
        return Banner::orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'link_url' => 'nullable|string|max:500',
            'link_text' => 'nullable|string|max:100',
            'image_url' => 'nullable|string|max:500',
            'bg_color' => 'nullable|string|max:20',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);
        return Banner::create($validated);
    }

    public function show(Banner $banner)
    {
        return $banner;
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'link_url' => 'nullable|string|max:500',
            'link_text' => 'nullable|string|max:100',
            'image_url' => 'nullable|string|max:500',
            'bg_color' => 'nullable|string|max:20',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);
        $banner->update($validated);
        return $banner;
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function reorder(Request $request)
    {
        $request->validate(['banners' => 'required|array']);
        foreach ($request->banners as $item) {
            Banner::where('id', $item['id'])->update(['sort_order' => $item['sort_order'] ?? 0]);
        }
        return response()->json(['message' => 'Reordered']);
    }
}
