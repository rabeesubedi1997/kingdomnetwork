<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/kingdom.php', 'kingdom');
    }

    public function boot(): void
    {
        $this->publishes([
            __DIR__ . '/../config/kingdom.php' => config_path('kingdom.php'),
        ], 'config');
    }
}