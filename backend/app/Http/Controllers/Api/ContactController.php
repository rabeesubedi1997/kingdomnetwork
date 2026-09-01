<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:500',
            'message' => 'required|string|max:5000',
            'phone' => 'nullable|string|max:20',
            'website' => 'nullable|string|max:255',
            '_honeypot' => 'nullable|string|max:10',
        ]);

        if (!empty($validated['_honeypot']) || !empty($validated['website'])) {
            Log::warning('Honeypot triggered on contact form', ['email' => $validated['email'], 'ip' => $request->ip()]);
            return response()->json(['message' => 'Message sent successfully!'], 201);
        }

        $submission = ContactSubmission::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
        ]);

        try {
            Mail::raw(
                "New contact submission:\n\nName: {$submission->name}\nEmail: {$submission->email}\nSubject: {$submission->subject}\nMessage: {$submission->message}",
                function ($message) use ($submission) {
                    $message->to(config('mail.from.address'))
                        ->subject("New Contact: {$submission->subject}")
                        ->replyTo($submission->email, $submission->name);
                }
            );
        } catch (\Throwable $e) {
            Log::error('Failed to send contact notification email', ['error' => $e->getMessage()]);
        }

        return response()->json($submission, 201);
    }
}
