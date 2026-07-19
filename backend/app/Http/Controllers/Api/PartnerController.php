<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;

class PartnerController extends Controller
{
    public function index()
    {
        return Partner::where('is_active', true)->orderBy('sort_order')->get();
    }
}
