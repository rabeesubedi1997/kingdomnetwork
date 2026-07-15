<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuleSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_name',
        'is_enabled',
        'config',
        'sort_order',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'config' => 'array',
    ];

    public static function isEnabled(string $module): bool
    {
        $setting = static::where('module_name', $module)->first();
        return $setting?->is_enabled ?? config("kingdom.modules.{$module}", false);
    }

    public static function getConfig(string $module): array
    {
        $setting = static::where('module_name', $module)->first();
        return $setting?->config ?? [];
    }
}