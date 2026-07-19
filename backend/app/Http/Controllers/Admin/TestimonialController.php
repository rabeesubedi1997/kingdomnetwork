<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index()
    {
        return Testimonial::orderBy('sort_order')->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'content' => 'required|string',
            'photo_url' => 'nullable|string|max:500',
            'rating' => 'integer|min:1|max:5',
            'is_active' => 'boolean',
        ]);
        return Testimonial::create($validated);
    }

    public function show(Testimonial $testimonial)
    {
        return $testimonial;
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'position' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'content' => 'sometimes|string',
            'photo_url' => 'nullable|string|max:500',
            'rating' => 'integer|min:1|max:5',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);
        $testimonial->update($validated);
        return $testimonial;
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return response()->noContent();
    }
}
