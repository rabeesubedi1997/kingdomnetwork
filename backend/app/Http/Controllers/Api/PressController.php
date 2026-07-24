<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\PressAccessRequestNotification;
use App\Models\PressAccessRequest;
use App\Models\PressKit;
use App\Models\Film;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class PressController extends Controller
{
    public function index()
    {
        $kits = PressKit::where('is_public', true)
            ->with(['film'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($kits);
    }

    public function filmKit(string $filmSlug)
    {
        $film = Film::published()->where('slug', $filmSlug)->firstOrFail();
        $kit = $film->pressKit;
        if (!$kit) {
            return response()->json(null, 404);
        }
        return response()->json($kit);
    }

    public function assets(string $filmSlug)
    {
        $film = Film::published()->where('slug', $filmSlug)->firstOrFail();
        $kit = $film->pressKit;
        if (!$kit) {
            return response()->json(null, 404);
        }
        return response()->json($kit->assets);
    }

    public function requestAccess(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'organization' => 'nullable|string|max:255',
            'reason' => 'required|string|max:1000',
        ]);

        $requestRecord = PressAccessRequest::create($validated);

        Mail::to(config('mail.from.address'))->send(new PressAccessRequestNotification(
            name: $requestRecord->name,
            email: $requestRecord->email,
            organization: $requestRecord->organization,
            reason: $requestRecord->reason,
        ));

        return response()->json(['message' => 'Access request submitted successfully.'], 201);
    }
}
