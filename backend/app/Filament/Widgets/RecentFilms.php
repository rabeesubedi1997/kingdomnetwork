<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;
use App\Models\Film;

class RecentFilms extends Widget
{
    protected string $view = 'filament.widgets.recent-films';
    protected int | string | array $columnSpan = 'full';
    protected static ?int $sort = 2;

    public function getFilms()
    {
        return Film::latest('created_at')
            ->with(['director', 'genres'])
            ->take(5)
            ->get();
    }
}