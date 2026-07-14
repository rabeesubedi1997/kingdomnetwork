<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScreeningRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'film_id',
        'name',
        'email',
        'phone',
        'organization',
        'venue_name',
        'venue_address',
        'preferred_date',
        'preferred_time',
        'expected_attendees',
        'purpose',
        'technical_requirements',
        'status',
        'notes',
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'expected_attendees' => 'integer',
    ];

    public function film(): BelongsTo
    {
        return $this->belongsTo(Film::class);
    }
}