<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;

class CareerController extends Controller
{
    public function index(Request $request)
    {
        $query = Job::open()->published()
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc');

        if ($request->filled('department')) {
            $query->where('department', $request->department);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $perPage = min($request->integer('per_page', 20), 50);

        return $query->paginate($perPage);
    }

    public function show(string $slug)
    {
        $job = Job::open()->published()->where('slug', $slug)->firstOrFail();
        return response()->json($job);
    }

    public function apply(Request $request, string $slug)
    {
        $job = Job::open()->published()->where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'cover_letter' => 'nullable|string|max:5000',
            'portfolio_url' => 'nullable|url|max:500',
            'linkedin_url' => 'nullable|url|max:500',
        ]);

        $data = $request->except('resume');

        if ($request->hasFile('resume')) {
            $data['resume_path'] = $request->file('resume')->store('resumes', 'media');
        }

        $application = $job->applications()->create($data);

        return response()->json($application, 201);
    }
}
