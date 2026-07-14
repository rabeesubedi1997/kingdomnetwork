<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SiteController;

Route::get('/', [SiteController::class, 'show']);
Route::get('/menus/{location}', [SiteController::class, 'menu']);