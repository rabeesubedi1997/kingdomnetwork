<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'event_type',
        'start_datetime',
        'end_datetime',
        'venue_name',
        'venue_address',
        'venue_city',
        'venue_country',
        'lat',
        'lng',
        'film_id',
        'poster_id',
        'ticket_url',
        'is_public',
        'rsvp_required',
        'max_attendees',
    ];

    protected $casts = [
        'start_datetime' => 'datetime',
        'end_datetime' => 'datetime',
        'lat' => 'decimal:8',
        'lng' => 'decimal:8',
        'is_public' => 'boolean',
        'rsvp_required' => 'boolean',
        'max_attendees' => 'integer',
    ];

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_datetime', '>=', now());
    }

    public function film(): BelongsTo
    {
        return $this->belongsTo(Film::class);
    }

    public function poster(): BelongsTo
    {
        return $this->belongsTo(\Spatie\MediaLibrary\MediaCollections\Models\Media::class, 'poster_id');
    }
}