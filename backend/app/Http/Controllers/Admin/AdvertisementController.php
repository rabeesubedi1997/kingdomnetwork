<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use Illuminate\Http\Request;

class AdvertisementController extends Controller
{
    public function index()
    {
        return Advertisement::orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:50',
            'image_url' => 'nullable|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'code' => 'nullable|string',
            'position' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
        ]);
        return Advertisement::create($validated);
    }

    public function show(Advertisement $advertisement)
    {
        return $advertisement;
    }

    public function update(Request $request, Advertisement $advertisement)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:50',
            'image_url' => 'nullable|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'code' => 'nullable|string',
            'position' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
        ]);
        $advertisement->update($validated);
        return $advertisement;
    }

    public function destroy(Advertisement $advertisement)
    {
        $advertisement->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
