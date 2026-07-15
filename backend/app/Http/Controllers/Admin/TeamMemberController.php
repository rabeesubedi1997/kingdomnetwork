<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\TeamMemberResource;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TeamMemberController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return TeamMemberResource::collection(TeamMember::orderBy('sort_order')->paginate(20));
    }

    public function show(TeamMember $teamMember): TeamMemberResource
    {
        return new TeamMemberResource($teamMember);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'social_links' => 'nullable|array',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $teamMember = TeamMember::create($data);

        return response()->json(new TeamMemberResource($teamMember), 201);
    }

    public function update(Request $request, TeamMember $teamMember): TeamMemberResource
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'social_links' => 'nullable|array',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $teamMember->update($data);

        return new TeamMemberResource($teamMember);
    }

    public function destroy(TeamMember $teamMember): JsonResponse
    {
        $teamMember->delete();

        return response()->json(null, 204);
    }
}
