<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FilmCast extends Model
{
    use HasFactory;

    protected $table = 'film_cast';

    protected $fillable = [
        'film_id',
        'person_id',
        'role_name',
        'character_name',
        'is_lead',
        'sort_order',
    ];

    protected $casts = [
        'is_lead' => 'boolean',
    ];

    public function film(): BelongsTo
    {
        return $this->belongsTo(Film::class);
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }
}