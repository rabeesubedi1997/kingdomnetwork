<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;

class ContactSubmissionController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactSubmission::orderBy('created_at', 'desc');
        if ($request->status) {
            $query->where('status', $request->status);
        }
        return $query->paginate($request->per_page ?? 20);
    }

    public function show(ContactSubmission $contactSubmission)
    {
        return $contactSubmission;
    }

    public function update(Request $request, ContactSubmission $contactSubmission)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,read,replied,archived',
        ]);
        $contactSubmission->update($validated);
        return $contactSubmission;
    }

    public function destroy(ContactSubmission $contactSubmission)
    {
        $contactSubmission->delete();
        return response()->noContent();
    }
}
