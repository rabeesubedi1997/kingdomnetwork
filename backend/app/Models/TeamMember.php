<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'bio',
        'photo_id',
        'email',
        'phone',
        'birth_date',
        'birth_place',
        'imdb_url',
        'instagram_url',
        'twitter_url',
        'linkedin_url',
        'website_url',
        'social_links',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'social_links' => 'array',
        'is_active' => 'boolean',
        'birth_date' => 'date',
    ];

    public function photo(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'photo_id');
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo?->url;
    }
}
