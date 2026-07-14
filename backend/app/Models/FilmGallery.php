<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FilmGallery extends Model
{
    use HasFactory;

    protected $table = 'film_gallery';

    protected $fillable = [
        'film_id',
        'media_id',
        'caption',
        'type',
        'sort_order',
    ];
}