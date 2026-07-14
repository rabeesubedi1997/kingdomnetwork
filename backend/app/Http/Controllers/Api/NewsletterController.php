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

        $subscriber = NewsletterSubscriber::updateOrCreate(
            ['email' => $validated['email']],
            [
                'name' => $validated['name'] ?? null,
                'tags' => $validated['tags'] ?? [],
                'is_subscribed' => true,
                'confirmation_token' => Str::random(64),
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

        $subscriber = NewsletterSubscriber::where('metadata->confirmation_token', $validated['token'])->first();

        if (!$subscriber) {
            return response()->json(['message' => 'Invalid confirmation token.'], 404);
        }

        $subscriber->update([
            'is_confirmed' => true,
            'confirmed_at' => now(),
            'confirmation_token' => null,
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
            'is_subscribed' => false,
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

        $subscriber->update([
            'tags' => $validated['tags'],
            'frequency' => $validated['frequency'] ?? 'weekly',
        ]);

        return response()->json(['message' => 'Preferences updated.']);
    }
}
