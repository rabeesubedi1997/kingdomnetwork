<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsletterCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject',
        'preheader',
        'html_content',
        'text_content',
        'segment_tags',
        'status',
        'scheduled_at',
        'sent_at',
        'stats',
    ];

    protected $casts = [
        'segment_tags' => 'array',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'stats' => 'array',
    ];
}