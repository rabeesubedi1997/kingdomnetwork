<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PressKit extends Model
{
    use HasFactory;

    public function film(): BelongsTo
    {
        return $this->belongsTo(Film::class);
    }

    protected $fillable = [
        'film_id',
        'title',
        'slug',
        'logline',
        'synopsis_short',
        'synopsis_long',
        'key_cast',
        'key_crew',
        'technical_specs',
        'festival_history',
        'awards',
        'assets',
        'contact_email',
        'contact_phone',
        'is_public',
        'password',
    ];

    protected $casts = [
        'key_cast' => 'array',
        'key_crew' => 'array',
        'technical_specs' => 'array',
        'festival_history' => 'array',
        'awards' => 'array',
        'assets' => 'array',
        'is_public' => 'boolean',
    ];
}