<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\NewsletterController;

Route::get('/', [SiteController::class, 'show']);
Route::get('/menus/{location}', [SiteController::class, 'menu']);

Route::get('/newsletter/confirm', [NewsletterController::class, 'confirmFromLink']);