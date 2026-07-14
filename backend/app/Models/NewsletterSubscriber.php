<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'name',
        'source',
        'status',
        'confirmed_at',
        'unsubscribed_at',
        'tags',
        'metadata',
    ];

    protected $casts = [
        'confirmed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
        'tags' => 'array',
        'metadata' => 'array',
    ];

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }
}