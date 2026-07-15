<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;

class BannerController extends Controller
{
    public function index()
    {
        return Banner::where('is_active', true)->orderBy('sort_order')->get();
    }
}
