<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;
use App\Models\JobApplication;

class RecentApplications extends Widget
{
    protected string $view = 'filament.widgets.recent-applications';
    protected int | string | array $columnSpan = 'full';
    protected static ?int $sort = 3;

    public function getApplications()
    {
        return JobApplication::latest('created_at')
            ->with('job')
            ->take(5)
            ->get();
    }
}