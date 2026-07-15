<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ScreeningRequest;
use Illuminate\Http\Request;

class ScreeningController extends Controller
{
    public function request(Request $request)
    {
        $validated = $request->validate([
            'film_id' => 'required|integer|exists:films,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'organization' => 'nullable|string|max:255',
            'venue_name' => 'required|string|max:255',
            'venue_address' => 'nullable|string|max:500',
            'preferred_date' => 'required|date|after:today',
            'preferred_time' => 'nullable|string|max:255',
            'expected_attendees' => 'required|integer|min:1|max:50000',
            'purpose' => 'nullable|string|max:2000',
            'technical_requirements' => 'nullable|string|max:5000',
            'notes' => 'nullable|string|max:5000',
        ]);

        $validated['status'] = 'pending';

        $screening = ScreeningRequest::create($validated);

        return response()->json($screening, 201);
    }
}
