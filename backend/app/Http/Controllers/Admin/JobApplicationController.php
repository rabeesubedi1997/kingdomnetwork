<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = JobApplication::with('job')->orderBy('created_at', 'desc');
        if ($request->job_id) {
            $query->where('job_id', $request->job_id);
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        return $query->paginate($request->per_page ?? 20);
    }

    public function show(JobApplication $jobApplication)
    {
        return $jobApplication->load('job');
    }

    public function update(Request $request, JobApplication $jobApplication)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,reviewed,shortlisted,rejected,accepted',
            'notes' => 'nullable|string',
        ]);
        $jobApplication->update($validated);
        return $jobApplication->load('job');
    }

    public function destroy(JobApplication $jobApplication)
    {
        $jobApplication->delete();
        return response()->noContent();
    }
}
