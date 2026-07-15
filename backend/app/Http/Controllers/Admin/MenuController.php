<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        return Menu::with('items.children')->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255|unique:menus,location',
            'is_active' => 'boolean',
        ]);

        return Menu::create($validated);
    }

    public function show(Menu $menu)
    {
        return $menu->load('items.children');
    }

    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255|unique:menus,location,' . $menu->id,
            'is_active' => 'boolean',
        ]);

        $menu->update($validated);
        return $menu->load('items.children');
    }

    public function destroy(Menu $menu)
    {
        $menu->items()->delete();
        $menu->delete();
        return response()->noContent();
    }
}
