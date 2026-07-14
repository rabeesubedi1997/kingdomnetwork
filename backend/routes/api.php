<?php

use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\FilmController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\CareerController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\PressController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ScreeningController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public endpoints
    Route::get('/site', [SiteController::class, 'show']);
    Route::get('/menus/{location}', [SiteController::class, 'menu']);
    Route::get('/about', [AboutController::class, 'show']);

    // Films
    Route::get('/films', [FilmController::class, 'index']);
    Route::get('/films/featured', [FilmController::class, 'featured']);
    Route::get('/films/status/{status}', [FilmController::class, 'byStatus']);
    Route::get('/films/{slug}', [FilmController::class, 'show']);
    Route::get('/films/{slug}/gallery', [FilmController::class, 'gallery']);
    Route::get('/films/{slug}/press-kit', [FilmController::class, 'pressKit']);
    Route::get('/films/{slug}/screenings', [FilmController::class, 'screenings']);

    // News
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/featured', [NewsController::class, 'featured']);
    Route::get('/news/category/{slug}', [NewsController::class, 'byCategory']);
    Route::get('/news/tag/{slug}', [NewsController::class, 'byTag']);
    Route::get('/news/{slug}', [NewsController::class, 'show']);

    // Careers
    Route::get('/careers', [CareerController::class, 'index']);
    Route::get('/careers/{slug}', [CareerController::class, 'show']);
    Route::post('/careers/{slug}/apply', [CareerController::class, 'apply']);

    // Events
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{slug}', [EventController::class, 'show']);
    Route::post('/events/{slug}/rsvp', [EventController::class, 'rsvp']);

    // Gallery
    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::get('/gallery/{slug}', [GalleryController::class, 'album']);

    // Press
    Route::get('/press', [PressController::class, 'index']);
    Route::get('/press/{filmSlug}', [PressController::class, 'filmKit']);
    Route::get('/press/{filmSlug}/assets', [PressController::class, 'assets']);
    Route::post('/press/request-access', [PressController::class, 'requestAccess']);

    // Newsletter
    Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);
    Route::post('/newsletter/confirm', [NewsletterController::class, 'confirm']);
    Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe']);
    Route::post('/newsletter/preferences', [NewsletterController::class, 'preferences']);

    // Contact
    Route::post('/contact', [ContactController::class, 'store']);

    // Screening Requests
    Route::post('/screenings/request', [ScreeningController::class, 'request']);

    // Protected routes (Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', fn(Request $request) => $request->user());
        Route::post('/logout', fn(Request $request) => $request->user()->currentAccessToken()->delete());
    });
});