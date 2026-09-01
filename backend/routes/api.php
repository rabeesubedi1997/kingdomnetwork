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
use App\Http\Controllers\Api\TestimonialController as ApiTestimonialController;
use App\Http\Controllers\Api\PartnerController as ApiPartnerController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\AdvertisementController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\MenuItemController;
use App\Http\Controllers\Admin\PageController as AdminPageController;
use App\Http\Controllers\Admin\PageSectionController;
use App\Http\Controllers\Admin\ContactSubmissionController;
use App\Http\Controllers\Admin\JobApplicationController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\SearchController as AdminSearchController;
use App\Http\Controllers\Admin\SeoController;
use App\Http\Controllers\Admin\PartnerController;
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
    Route::get('/news/rss', [NewsController::class, 'rss']);
    Route::get('/news/{slug}', [NewsController::class, 'show']);

    // Careers
    Route::get('/careers', [CareerController::class, 'index']);
    Route::get('/careers/{slug}', [CareerController::class, 'show']);
    Route::post('/careers/{slug}/apply', [CareerController::class, 'apply'])->middleware('throttle:5,10');

    // Events
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{slug}', [EventController::class, 'show']);
    Route::post('/events/{slug}/rsvp', [EventController::class, 'rsvp'])->middleware('throttle:10,10');

    // Gallery
    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::get('/gallery/{slug}', [GalleryController::class, 'album']);

    // Press
    Route::get('/press', [PressController::class, 'index']);
    Route::get('/press/{filmSlug}', [PressController::class, 'filmKit']);
    Route::get('/press/{filmSlug}/assets', [PressController::class, 'assets']);
    Route::post('/press/request-access', [PressController::class, 'requestAccess'])->middleware('throttle:5,10');

    // Newsletter
    Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->middleware('throttle:newsletter');
    Route::post('/newsletter/confirm', [NewsletterController::class, 'confirm']);
    Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe'])->middleware('throttle:newsletter');
    Route::post('/newsletter/preferences', [NewsletterController::class, 'preferences']);

    // Pages
    Route::get('/pages/{slug}', [ApiPageController::class, 'show']);

    // Banners
    Route::get('/banners', [ApiBannerController::class, 'index']);

    // Advertisements
    Route::get('/advertisements', [ApiAdvertisementController::class, 'index']);
    Route::get('/advertisements/position/{position}', [ApiAdvertisementController::class, 'byPosition']);

    // Testimonials
    Route::get('/testimonials', [ApiTestimonialController::class, 'index']);

    // Partners
    Route::get('/partners', [ApiPartnerController::class, 'index']);

    // Contact
    Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:contact');

    // Awards
    Route::get('/awards', [AwardController::class, 'index']);

    // People
    Route::get('/people', [ApiPeopleController::class, 'index']);
    Route::get('/people/{slug}', [ApiPeopleController::class, 'show']);

    // Search
    Route::get('/search', [SearchController::class, 'search']);

    // Screening Requests
    Route::post('/screenings/request', [ScreeningController::class, 'request'])->middleware('throttle:5,10');

    // Sitemap & Robots
    Route::get('/sitemap.xml', [SiteController::class, 'sitemap']);
    Route::get('/robots.txt', [SiteController::class, 'robots']);

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
        Route::get('/dashboard/notifications', [DashboardController::class, 'notifications']);
        Route::get('/search', [AdminSearchController::class, 'search']);
        Route::get('/seo/pages', [SeoController::class, 'index']);
        Route::post('/seo/pages/bulk-update', [SeoController::class, 'bulkUpdate']);
        Route::delete('/seo/pages/{route}', [SeoController::class, 'destroy']);

        Route::post('/site-settings/bulk-update', [SiteSettingController::class, 'bulkUpdate']);
        Route::post('/site-settings/upload-logo', [SiteSettingController::class, 'uploadLogo']);
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
        Route::get('users', [UserController::class, 'index']);
        Route::post('users', [UserController::class, 'store']);
        Route::get('users/{user}', [UserController::class, 'show']);
        Route::put('users/{user}', [UserController::class, 'update']);
        Route::delete('users/{user}', [UserController::class, 'destroy']);
        Route::get('roles', [UserController::class, 'roles']);
        Route::get('contact-submissions', [ContactSubmissionController::class, 'index']);
        Route::get('contact-submissions/{contactSubmission}', [ContactSubmissionController::class, 'show']);
        Route::put('contact-submissions/{contactSubmission}', [ContactSubmissionController::class, 'update']);
        Route::delete('contact-submissions/{contactSubmission}', [ContactSubmissionController::class, 'destroy']);
        Route::get('job-applications', [JobApplicationController::class, 'index']);
        Route::get('job-applications/{jobApplication}', [JobApplicationController::class, 'show']);
        Route::put('job-applications/{jobApplication}', [JobApplicationController::class, 'update']);
        Route::delete('job-applications/{jobApplication}', [JobApplicationController::class, 'destroy']);

        Route::get('testimonials', [TestimonialController::class, 'index']);
        Route::post('testimonials', [TestimonialController::class, 'store']);
        Route::get('testimonials/{testimonial}', [TestimonialController::class, 'show']);
        Route::put('testimonials/{testimonial}', [TestimonialController::class, 'update']);
        Route::delete('testimonials/{testimonial}', [TestimonialController::class, 'destroy']);

        Route::get('partners', [PartnerController::class, 'index']);
        Route::post('partners', [PartnerController::class, 'store']);
        Route::get('partners/{partner}', [PartnerController::class, 'show']);
        Route::put('partners/{partner}', [PartnerController::class, 'update']);
        Route::delete('partners/{partner}', [PartnerController::class, 'destroy']);
        Route::get('pages/{page}/sections', [PageSectionController::class, 'index']);
        Route::post('pages/{page}/sections', [PageSectionController::class, 'store']);
        Route::put('pages/{page}/sections/{pageSection}', [PageSectionController::class, 'update']);
        Route::delete('pages/{page}/sections/{pageSection}', [PageSectionController::class, 'destroy']);
        Route::post('pages/{page}/sections/reorder', [PageSectionController::class, 'reorder']);
    });
});
