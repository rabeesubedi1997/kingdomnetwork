<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'department',
        'type',
        'location',
        'description',
        'requirements',
        'benefits',
        'salary_range',
        'is_remote',
        'is_open',
        'closes_at',
        'published_at',
    ];

    protected $casts = [
        'closes_at' => 'datetime',
        'published_at' => 'datetime',
        'is_remote' => 'boolean',
        'is_open' => 'boolean',
    ];

    public function scopeOpen($query)
    {
        return $query->where('is_open', true);
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }
}