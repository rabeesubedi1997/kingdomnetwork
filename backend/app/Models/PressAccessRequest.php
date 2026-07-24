<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PressAccessRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'organization',
        'reason',
    ];
}
