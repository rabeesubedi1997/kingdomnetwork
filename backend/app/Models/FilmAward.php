<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FilmAward extends Model
{
    use HasFactory;

    protected $fillable = [
        'film_id',
        'award_name',
        'category',
        'year',
        'result',
        'notes',
    ];

    protected $casts = [
        'year' => 'integer',
    ];

    public function film(): BelongsTo
    {
        return $this->belongsTo(Film::class);
    }
}