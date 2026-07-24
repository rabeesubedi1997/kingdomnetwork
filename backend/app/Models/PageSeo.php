<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageSeo extends Model
{
    use HasFactory;

    protected $fillable = [
        'route',
        'title',
        'description',
        'og_title',
        'og_description',
        'og_image',
        'noindex',
        'canonical_url',
        'schema_type',
    ];

    protected $casts = [
        'noindex' => 'boolean',
    ];
}
