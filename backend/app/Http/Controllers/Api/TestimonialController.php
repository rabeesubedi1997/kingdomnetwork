<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;

class TestimonialController extends Controller
{
    public function index()
    {
        return Testimonial::where('is_active', true)->orderBy('sort_order')->get();
    }
}
