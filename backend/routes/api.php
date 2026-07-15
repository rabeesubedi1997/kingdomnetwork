<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\FilmController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\JobController;
use App\Http\Controllers\Admin\AlbumController;
use App\Http\Controllers\Admin\PressKitController;
use App\Http\Controllers\Admin\TeamMemberController;
use App\Http\Controllers\Admin\PersonController;
use App\Http\Controllers\Admin\GenreController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\NewsletterController as AdminNewsletterController;
use App\Http\Controllers\Admin\ModuleSettingController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\FilmController as ApiFilmController;
use App\Http\Controllers\Api\AwardController;
use App\Http\Controllers\Api\PeopleController as ApiPeopleController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\CareerController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\PressController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\BannerController as ApiBannerController;
use App\Http\Controllers\Api\AdvertisementController as ApiAdvertisementController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ScreeningController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\AdvertisementController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\MenuItemController;
use App\Http\Controllers\Admin\PageController as AdminPageController;
use App\Http\Controllers\Api\PageController as ApiPageController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public endpoints
    Route::get('/site', [SiteController::class, 'show']);
    Route::get('/menus/{location}', [SiteController::class, 'menu']);
    Route::get('/about', [AboutController::class, 'show']);
    Route::get('/team/{id}', [AboutController::class, 'team']);

    // Films
    Route::get('/films', [ApiFilmController::class, 'index']);
    Route::get('/films/featured', [ApiFilmController::class, 'featured']);
    Route::get('/films/status/{status}', [ApiFilmController::class, 'byStatus']);
    Route::get('/films/{slug}', [ApiFilmController::class, 'show']);
    Route::get('/films/{slug}/gallery', [ApiFilmController::class, 'gallery']);
    Route::get('/films/{slug}/press-kit', [ApiFilmController::class, 'pressKit']);
    Route::get('/films/{slug}/screenings', [ApiFilmController::class, 'screenings']);

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

    // Pages
    Route::get('/pages/{slug}', [ApiPageController::class, 'show']);

    // Banners
    Route::get('/banners', [ApiBannerController::class, 'index']);

    // Advertisements
    Route::get('/advertisements', [ApiAdvertisementController::class, 'index']);
    Route::get('/advertisements/position/{position}', [ApiAdvertisementController::class, 'byPosition']);

    // Contact
    Route::post('/contact', [ContactController::class, 'store']);

    // Awards
    Route::get('/awards', [AwardController::class, 'index']);

    // People
    Route::get('/people', [ApiPeopleController::class, 'index']);
    Route::get('/people/{slug}', [ApiPeopleController::class, 'show']);

    // Search
    Route::get('/search', [SearchController::class, 'search']);

    // Screening Requests
    Route::post('/screenings/request', [ScreeningController::class, 'request']);

    // Public login/logout (no auth)
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Protected routes (Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', fn(Request $request) => $request->user());
    });

    // Admin login (no auth)
    Route::post('/admin/login', [AuthController::class, 'login']);

    // Admin routes (authenticated)
    Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::post('/site-settings/bulk-update', [SiteSettingController::class, 'bulkUpdate']);
        Route::apiResource('site-settings', SiteSettingController::class);
        Route::apiResource('films', FilmController::class);
        Route::apiResource('posts', PostController::class);
        Route::apiResource('jobs', JobController::class);
        Route::apiResource('albums', AlbumController::class);
        Route::apiResource('press-kits', PressKitController::class);
        Route::apiResource('team-members', TeamMemberController::class);
        Route::apiResource('people', PersonController::class);
        Route::apiResource('genres', GenreController::class);

        Route::get('/media-library', [MediaController::class, 'index']);
        Route::post('/media-library/upload', [MediaController::class, 'upload']);
        Route::post('/media-library/upload-multiple', [MediaController::class, 'uploadMultiple']);
        Route::delete('/media-library/{id}', [MediaController::class, 'destroy']);
        Route::post('/media-library/bulk-delete', [MediaController::class, 'bulkDelete']);

        Route::get('/modules', [ModuleSettingController::class, 'index']);
        Route::put('/modules/{moduleSetting}', [ModuleSettingController::class, 'update']);
        Route::post('/modules/reorder', [ModuleSettingController::class, 'reorder']);
        Route::post('/modules/bulk-update', [ModuleSettingController::class, 'bulkUpdate']);

        Route::get('/banners', [BannerController::class, 'index']);
        Route::post('/banners', [BannerController::class, 'store']);
        Route::get('/banners/{banner}', [BannerController::class, 'show']);
        Route::put('/banners/{banner}', [BannerController::class, 'update']);
        Route::delete('/banners/{banner}', [BannerController::class, 'destroy']);
        Route::post('/banners/reorder', [BannerController::class, 'reorder']);

        Route::get('/advertisements', [AdvertisementController::class, 'index']);
        Route::post('/advertisements', [AdvertisementController::class, 'store']);
        Route::get('/advertisements/{advertisement}', [AdvertisementController::class, 'show']);
        Route::put('/advertisements/{advertisement}', [AdvertisementController::class, 'update']);
        Route::delete('/advertisements/{advertisement}', [AdvertisementController::class, 'destroy']);

        Route::get('/newsletter/subscribers', [AdminNewsletterController::class, 'subscribers']);
        Route::get('/newsletter/subscribers/{subscriber}', [AdminNewsletterController::class, 'subscriber']);
        Route::delete('/newsletter/subscribers/{subscriber}', [AdminNewsletterController::class, 'deleteSubscriber']);
        Route::get('/newsletter/stats', [AdminNewsletterController::class, 'stats']);

        Route::apiResource('menus', MenuController::class);
        Route::get('menus/{menu}/items', [MenuItemController::class, 'index']);
        Route::apiResource('menu-items', MenuItemController::class);
        Route::post('menu-items/reorder', [MenuItemController::class, 'reorder']);

        Route::apiResource('pages', AdminPageController::class);
    });
});
