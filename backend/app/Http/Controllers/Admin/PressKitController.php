<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PressKitResource;
use App\Models\PressKit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PressKitController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return PressKitResource::collection(PressKit::with('film')->orderByDesc('created_at')->paginate(20));
    }

    public function show(PressKit $pressKit): PressKitResource
    {
        $pressKit->load('film');

        return new PressKitResource($pressKit);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'film_id' => 'required|exists:films,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:press_kits,slug',
            'logline' => 'nullable|string|max:500',
            'synopsis_short' => 'nullable|string',
            'synopsis_long' => 'nullable|string',
            'key_cast' => 'nullable|array',
            'key_crew' => 'nullable|array',
            'technical_specs' => 'nullable|array',
            'festival_history' => 'nullable|array',
            'awards' => 'nullable|array',
            'assets' => 'nullable|array',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'is_public' => 'boolean',
            'password' => 'nullable|string|max:255',
        ]);

        $pressKit = PressKit::create($data);

        return response()->json(new PressKitResource($pressKit->load('film')), 201);
    }

    public function update(Request $request, PressKit $pressKit): PressKitResource
    {
        $data = $request->validate([
            'film_id' => 'required|exists:films,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:press_kits,slug,' . $pressKit->id,
            'logline' => 'nullable|string|max:500',
            'synopsis_short' => 'nullable|string',
            'synopsis_long' => 'nullable|string',
            'key_cast' => 'nullable|array',
            'key_crew' => 'nullable|array',
            'technical_specs' => 'nullable|array',
            'festival_history' => 'nullable|array',
            'awards' => 'nullable|array',
            'assets' => 'nullable|array',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'is_public' => 'boolean',
            'password' => 'nullable|string|max:255',
        ]);

        $pressKit->update($data);

        return new PressKitResource($pressKit->load('film'));
    }

    public function destroy(PressKit $pressKit): JsonResponse
    {
        $pressKit->delete();

        return response()->json(null, 204);
    }
}
