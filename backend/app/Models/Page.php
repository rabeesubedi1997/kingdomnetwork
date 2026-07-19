<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Page extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'slug',
        'title',
        'content',
        'meta_title',
        'meta_description',
        'meta_image_id',
        'schema_type',
        'is_active',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $appends = ['meta_image_url'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('meta_image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
    }

    public function metaImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'meta_image_id');
    }

    public function getMetaImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('meta_image') ?? $this->metaImage?->getUrl();
    }

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class)->orderBy('sort_order');
    }

    public function activeSections(): HasMany
    {
        return $this->hasMany(PageSection::class)->where('is_active', true)->orderBy('sort_order');
    }

    public function getSchemaTypes(): array
    {
        return [
            'WebPage',
            'AboutPage',
            'ContactPage',
            'FAQPage',
            'PrivacyPolicy',
            'TermsOfService',
        ];
    }
}