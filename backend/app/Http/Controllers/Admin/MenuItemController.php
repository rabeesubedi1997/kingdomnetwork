<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::with('children');
        if ($request->menu_id) {
            $query->where('menu_id', $request->menu_id)->whereNull('parent_id');
        }
        return $query->orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'parent_id' => 'nullable|exists:menu_items,id',
            'label' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'target' => 'in:_self,_blank',
            'module' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $maxSort = MenuItem::where('menu_id', $validated['menu_id'])->max('sort_order') ?? 0;
        $validated['sort_order'] = $maxSort + 1;

        return MenuItem::create($validated)->load('children');
    }

    public function show(MenuItem $menuItem)
    {
        return $menuItem->load('children');
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:menu_items,id',
            'label' => 'sometimes|string|max:255',
            'url' => 'nullable|string|max:255',
            'target' => 'in:_self,_blank',
            'module' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $menuItem->update($validated);
        return $menuItem->load('children');
    }

    public function destroy(MenuItem $menuItem)
    {
        $menuItem->children()->delete();
        $menuItem->delete();
        return response()->noContent();
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:menu_items,id',
            'items.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($request->items as $item) {
            MenuItem::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Menu items reordered']);
    }
}
