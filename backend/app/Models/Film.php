<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Film extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'slug',
        'title',
        'tagline',
        'synopsis',
        'short_description',
        'status',
        'release_date',
        'runtime_minutes',
        'rating',
        'language',
        'country',
        'budget',
        'box_office',
        'trailer_url',
        'trailer_embed_code',
        'director_id',
        'producer_id',
        'writer_id',
        'cinematographer_id',
        'editor_id',
        'composer_id',
        'is_featured',
        'sort_order',
        'published_at',
    ];

    protected $casts = [
        'release_date' => 'date',
        'published_at' => 'datetime',
        'budget' => 'integer',
        'box_office' => 'integer',
        'runtime_minutes' => 'integer',
        'is_featured' => 'boolean',
    ];

    protected $appends = ['poster_url', 'banner_url', 'gallery_images', 'trailer_embed_url'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('poster')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->withResponsiveImages();

        $this->addMediaCollection('banner')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->withResponsiveImages();

        $this->addMediaCollection('gallery')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'video/mp4'])
            ->withResponsiveImages();

        $this->addMediaCollection('trailer')
            ->singleFile()
            ->acceptsMimeTypes(['video/mp4', 'video/webm']);
    }

    // Relationships
    public function director(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'director_id');
    }

    public function producer(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'producer_id');
    }

    public function writer(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'writer_id');
    }

    public function cinematographer(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'cinematographer_id');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'editor_id');
    }

    public function composer(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'composer_id');
    }

    public function genres(): BelongsToMany
    {
        return $this->belongsToMany(Genre::class, 'film_genres')
            ->withTimestamps()
            ->orderBy('name');
    }

    public function cast(): HasMany
    {
        return $this->hasMany(FilmCast::class)->orderBy('sort_order');
    }

    public function crew(): HasMany
    {
        return $this->hasMany(FilmCrew::class)->orderBy('sort_order');
    }

    public function awards(): HasMany
    {
        return $this->hasMany(FilmAward::class)->orderByDesc('year');
    }

    public function locations(): HasMany
    {
        return $this->hasMany(FilmLocation::class)->orderBy('sort_order');
    }

    public function gallery(): HasMany
    {
        return $this->hasMany(FilmGallery::class)->orderBy('sort_order');
    }

    public function pressKit(): HasOne
    {
        return $this->hasOne(PressKit::class);
    }

    public function screenings(): HasMany
    {
        return $this->hasMany(ScreeningRequest::class, 'film_id')->where('preferred_date', '>=', now())->orderBy('preferred_date');
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeReleased($query)
    {
        return $query->where('status', 'released');
    }

    public function scopeUpcoming($query)
    {
        return $query->whereIn('status', ['post_production', 'pre_production', 'development', 'announced']);
    }

    // Accessors
    public function getPosterUrlAttribute(): ?string
    {
        $url = $this->getFirstMediaUrl('poster', 'thumb');
        if ($url === '') {
            $url = $this->getFirstMediaUrl('poster');
        }
        return $url !== '' ? $url : null;
    }

    public function getBannerUrlAttribute(): ?string
    {
        $url = $this->getFirstMediaUrl('banner', 'hero');
        if ($url === '') {
            $url = $this->getFirstMediaUrl('banner');
        }
        return $url !== '' ? $url : $this->poster_url;
    }

    public function getGalleryImagesAttribute(): array
    {
        return $this->getMedia('gallery')->map(function (Media $media) {
            return [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'thumb' => $media->getUrl('thumb'),
                'responsive' => $media->getResponsiveImages(),
                'caption' => $media->getCustomProperty('caption'),
                'type' => $media->getCustomProperty('type') ?? 'still',
            ];
        })->toArray();
    }

    public function getTrailerEmbedUrlAttribute(): ?string
    {
        if ($this->trailer_embed_code) {
            return $this->trailer_embed_code;
        }
        
        if ($this->trailer_url) {
            return $this->extractYouTubeEmbed($this->trailer_url);
        }
        
        return null;
    }

    public function getStatusConfigAttribute(): array
    {
        $statuses = config('kingdom.film_statuses');
        return $statuses[$this->status] ?? ['label' => ucfirst($this->status), 'color' => 'gray', 'icon' => 'heroicon-o-film'];
    }

    protected function extractYouTubeEmbed(string $url): ?string
    {
        $patterns = [
            '/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/',
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return "https://www.youtube.com/embed/{$matches[1]}";
            }
        }
        
        return null;
    }

    // JSON-LD Schema
    public function toJsonLd(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Movie',
            'name' => $this->title,
            'description' => $this->short_description ?? $this->synopsis,
            'image' => $this->banner_url ?? $this->poster_url,
            'datePublished' => $this->release_date?->toISOString(),
            'duration' => $this->runtime_minutes ? "PT{$this->runtime_minutes}M" : null,
            'contentRating' => $this->rating,
            'genre' => $this->genres->pluck('name')->toArray(),
            'director' => $this->director?->toJsonLd(),
            'producer' => $this->producer?->toJsonLd(),
            'actor' => $this->cast->where('is_lead', true)->map->person->map->toJsonLd()->toArray(),
            'trailer' => $this->trailer_embed_url ? [
                '@type' => 'VideoObject',
                'embedUrl' => $this->trailer_embed_url,
            ] : null,
            'productionCompany' => [
                '@type' => 'Organization',
                'name' => config('kingdom.brand.name'),
                'url' => config('app.url'),
            ],
        ];
    }
}