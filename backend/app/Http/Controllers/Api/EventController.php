<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRsvp;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::public()->upcoming()->orderBy('start_datetime');

        if ($request->filled('type')) {
            $query->where('event_type', $request->type);
        }

        $perPage = min($request->integer('per_page', 20), 50);

        return $query->paginate($perPage);
    }

    public function show(string $slug)
    {
        $event = Event::public()->where('slug', $slug)->firstOrFail();
        return response()->json($event);
    }

    public function rsvp(Request $request, string $slug)
    {
        $event = Event::public()->where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'guests' => 'nullable|integer|min:1|max:10',
            'message' => 'nullable|string|max:1000',
        ]);

        $rsvp = EventRsvp::create([
            'event_id' => $event->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'guests' => $validated['guests'] ?? 1,
            'message' => $validated['message'] ?? null,
        ]);

        return response()->json($rsvp, 201);
    }
}
