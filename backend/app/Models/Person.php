<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Person extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'name',
        'slug',
        'role',
        'bio',
        'birth_date',
        'birth_place',
        'imdb_url',
        'social_links',
        'is_active',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'social_links' => 'array',
        'is_active' => 'boolean',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photo')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->withResponsiveImages();
    }

    public function directedFilms(): HasMany
    {
        return $this->hasMany(Film::class, 'director_id');
    }

    public function producedFilms(): HasMany
    {
        return $this->hasMany(Film::class, 'producer_id');
    }

    public function writtenFilms(): HasMany
    {
        return $this->hasMany(Film::class, 'writer_id');
    }

    public function castRoles(): HasMany
    {
        return $this->hasMany(FilmCast::class);
    }

    public function crewRoles(): HasMany
    {
        return $this->hasMany(FilmCrew::class);
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('photo', 'thumb') ?? $this->getFirstMediaUrl('photo');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}