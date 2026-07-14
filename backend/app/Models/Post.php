<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Post extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'slug',
        'title',
        'excerpt',
        'content',
        'featured_image_id',
        'author_id',
        'category_id',
        'status',
        'featured',
        'reading_time',
        'published_at',
        'seo_title',
        'seo_description',
        'schema_type',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'featured' => 'boolean',
    ];

    protected $appends = ['featured_image_url', 'featured_image'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('featured_image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->withResponsiveImages();
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'author_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'post_tag');
    }

    public function getFeaturedImageUrlAttribute(): ?string
    {
        $url = $this->getFirstMediaUrl('featured_image');
        return $url !== '' ? $url : null;
    }

    public function getFeaturedImageAttribute(): ?array
    {
        $media = $this->getFirstMedia('featured_image');
        if (!$media) {
            return null;
        }
        return [
            'id' => $media->id,
            'url' => '/storage/' . $media->id . '/' . $media->file_name,
            'thumb' => '/storage/' . $media->id . '/' . $media->file_name,
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }
}