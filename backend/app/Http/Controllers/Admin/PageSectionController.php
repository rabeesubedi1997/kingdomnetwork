<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageSectionController extends Controller
{
    public function index(Page $page)
    {
        return $page->sections()->orderBy('sort_order')->get();
    }

    public function store(Request $request, Page $page): JsonResponse
    {
        $validated = $request->validate([
            'section_type' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'config' => 'nullable|array',
            'is_active' => 'boolean',
        ]);
        $types = PageSection::getAvailableTypes();
        if (!isset($types[$validated['section_type']])) {
            return response()->json(['message' => 'Invalid section type'], 422);
        }
        $maxOrder = $page->sections()->max('sort_order') ?? 0;
        $validated['sort_order'] = $maxOrder + 1;
        $section = $page->sections()->create($validated);
        return response()->json($section, 201);
    }

    public function update(Request $request, Page $page, PageSection $pageSection): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'config' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);
        $pageSection->update($validated);
        return response()->json($pageSection);
    }

    public function destroy(Page $page, PageSection $pageSection): JsonResponse
    {
        $pageSection->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request, Page $page): JsonResponse
    {
        $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|exists:page_sections,id',
            'sections.*.sort_order' => 'required|integer',
        ]);
        foreach ($request->sections as $item) {
            PageSection::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }
        return response()->json(['message' => 'Order updated']);
    }
}
