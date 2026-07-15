<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'name' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
        ]);

        $token = Str::random(64);
        $existing = NewsletterSubscriber::where('email', $validated['email'])->first();
        $subscriber = NewsletterSubscriber::updateOrCreate(
            ['email' => $validated['email']],
            [
                'name' => $validated['name'] ?? null,
                'tags' => $validated['tags'] ?? [],
                'status' => 'pending',
                'metadata' => array_merge(
                    $existing?->metadata ?? [],
                    ['confirmation_token' => $token]
                ),
            ]
        );

        // TODO: Send confirmation email

        return response()->json($subscriber, 201);
    }

    public function confirm(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
        ]);

        $subscriber = NewsletterSubscriber::all()->first(fn($s) => ($s->metadata['confirmation_token'] ?? null) === $validated['token']);

        if (!$subscriber) {
            return response()->json(['message' => 'Invalid confirmation token.'], 404);
        }

        $metadata = $subscriber->metadata;
        unset($metadata['confirmation_token']);

        $subscriber->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
            'metadata' => $metadata,
        ]);

        return response()->json(['message' => 'Email confirmed successfully.']);
    }

    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $subscriber = NewsletterSubscriber::where('email', $validated['email'])->first();

        if (!$subscriber) {
            return response()->json(['message' => 'Email not found.'], 404);
        }

        $subscriber->update([
            'status' => 'unsubscribed',
            'unsubscribed_at' => now(),
        ]);

        return response()->json(['message' => 'Unsubscribed successfully.']);
    }

    public function preferences(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'tags' => 'required|array',
            'frequency' => 'nullable|in:daily,weekly,monthly',
        ]);

        $subscriber = NewsletterSubscriber::where('email', $validated['email'])->first();

        if (!$subscriber) {
            return response()->json(['message' => 'Email not found.'], 404);
        }

        $metadata = array_merge($subscriber->metadata ?? [], [
            'frequency' => $validated['frequency'] ?? 'weekly',
        ]);
        $subscriber->update([
            'tags' => $validated['tags'],
            'metadata' => $metadata,
        ]);

        return response()->json(['message' => 'Preferences updated.']);
    }
}
