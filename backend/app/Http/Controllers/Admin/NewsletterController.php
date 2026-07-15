<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use App\Models\NewsletterCampaign;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribers(): JsonResponse
    {
        $subscribers = NewsletterSubscriber::orderBy('created_at', 'desc')->paginate(20);
        return response()->json($subscribers);
    }

    public function subscriber(NewsletterSubscriber $subscriber): JsonResponse
    {
        return response()->json($subscriber);
    }

    public function deleteSubscriber(NewsletterSubscriber $subscriber): JsonResponse
    {
        $subscriber->delete();
        return response()->json(null, 204);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total' => NewsletterSubscriber::count(),
            'confirmed' => NewsletterSubscriber::where('status', 'confirmed')->count(),
            'pending' => NewsletterSubscriber::where('status', 'pending')->count(),
            'unsubscribed' => NewsletterSubscriber::where('status', 'unsubscribed')->count(),
            'bounced' => NewsletterSubscriber::where('status', 'bounced')->count(),
        ]);
    }
}
