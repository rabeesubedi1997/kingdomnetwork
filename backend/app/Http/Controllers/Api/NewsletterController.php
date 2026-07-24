<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterConfirmation;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
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

        $confirmationUrl = url('/newsletter/confirm?token=' . $token);

        Mail::to($subscriber->email)->send(new NewsletterConfirmation($subscriber, $confirmationUrl));

        return response()->json($subscriber, 201);
    }

    public function confirm(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
        ]);

        $subscriber = $this->findByConfirmationToken($validated['token']);

        if (!$subscriber) {
            return response()->json(['message' => 'Invalid confirmation token.'], 404);
        }

        $this->markConfirmed($subscriber);

        return response()->json(['message' => 'Email confirmed successfully.']);
    }

    public function confirmFromLink(Request $request)
    {
        $token = $request->query('token');

        if (!$token) {
            $frontendUrl = env('APP_FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . '/?newsletter=invalid');
        }

        $subscriber = $this->findByConfirmationToken($token);

        if (!$subscriber) {
            $frontendUrl = env('APP_FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . '/?newsletter=invalid');
        }

        $this->markConfirmed($subscriber);

        $frontendUrl = env('APP_FRONTEND_URL', 'http://localhost:3000');
        return redirect($frontendUrl . '/?newsletter=confirmed');
    }

    private function findByConfirmationToken(string $token): ?NewsletterSubscriber
    {
        return NewsletterSubscriber::all()->first(fn($s) => ($s->metadata['confirmation_token'] ?? null) === $token);
    }

    private function markConfirmed(NewsletterSubscriber $subscriber): void
    {
        $metadata = $subscriber->metadata;
        unset($metadata['confirmation_token']);

        $subscriber->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
            'metadata' => $metadata,
        ]);
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
