<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    public function index()
    {
        return Partner::orderBy('sort_order')->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo_url' => 'nullable|string|max:500',
            'website_url' => 'nullable|string|max:500',
            'category' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);
        return Partner::create($validated);
    }

    public function show(Partner $partner)
    {
        return $partner;
    }

    public function update(Request $request, Partner $partner)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'logo_url' => 'nullable|string|max:500',
            'website_url' => 'nullable|string|max:500',
            'category' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);
        $partner->update($validated);
        return $partner;
    }

    public function destroy(Partner $partner)
    {
        $partner->delete();
        return response()->noContent();
    }
}
