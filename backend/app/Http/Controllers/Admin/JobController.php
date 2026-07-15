<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\JobResource;
use App\Models\Job;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return JobResource::collection(Job::withCount('applications')->orderByDesc('created_at')->paginate(20));
    }

    public function show(Job $job): JobResource
    {
        $job->loadCount('applications');

        return new JobResource($job);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'slug' => 'required|string|max:255|unique:jobs,slug',
            'title' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'type' => 'required|string|max:100',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'salary_range' => 'nullable|string|max:100',
            'is_remote' => 'boolean',
            'is_open' => 'boolean',
            'sort_order' => 'nullable|integer',
            'closes_at' => 'nullable|date',
            'published_at' => 'nullable|date',
        ]);

        $job = Job::create($data);

        return response()->json(new JobResource($job), 201);
    }

    public function update(Request $request, Job $job): JobResource
    {
        $data = $request->validate([
            'slug' => 'required|string|max:255|unique:jobs,slug,' . $job->id,
            'title' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'type' => 'required|string|max:100',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'salary_range' => 'nullable|string|max:100',
            'is_remote' => 'boolean',
            'is_open' => 'boolean',
            'sort_order' => 'nullable|integer',
            'closes_at' => 'nullable|date',
            'published_at' => 'nullable|date',
        ]);

        $job->update($data);

        return new JobResource($job);
    }

    public function destroy(Job $job): JsonResponse
    {
        $job->delete();

        return response()->json(null, 204);
    }
}
