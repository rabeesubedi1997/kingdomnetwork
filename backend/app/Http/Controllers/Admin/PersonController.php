<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PersonResource;
use App\Models\Person;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PersonController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return PersonResource::collection(Person::orderBy('name')->paginate(20));
    }

    public function show(Person $person): PersonResource
    {
        return new PersonResource($person);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:people,slug',
            'role' => 'nullable|string|max:100',
            'bio' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'birth_place' => 'nullable|string|max:255',
            'imdb_url' => 'nullable|string|max:500',
            'social_links' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $person = Person::create($data);

        return response()->json(new PersonResource($person), 201);
    }

    public function update(Request $request, Person $person): PersonResource
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:people,slug,' . $person->id,
            'role' => 'nullable|string|max:100',
            'bio' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'birth_place' => 'nullable|string|max:255',
            'imdb_url' => 'nullable|string|max:500',
            'social_links' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $person->update($data);

        return new PersonResource($person);
    }

    public function destroy(Person $person): JsonResponse
    {
        $person->delete();

        return response()->json(null, 204);
    }
}
