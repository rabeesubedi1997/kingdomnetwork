<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class JobApplication extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'job_id',
        'name',
        'email',
        'phone',
        'cover_letter',
        'resume_id',
        'portfolio_url',
        'linkedin_url',
        'status',
        'notes',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    public function resume(): BelongsTo
    {
        return $this->belongsTo(\Spatie\MediaLibrary\MediaCollections\Models\Media::class, 'resume_id');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('resume')
            ->singleFile()
            ->acceptsMimeTypes(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
    }
}