<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Film;
use App\Models\JobApplication;
use App\Models\ContactSubmission;
use App\Models\Post;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Films', Film::count())
                ->description('Productions in pipeline')
                ->descriptionIcon('heroicon-m-film')
                ->color('primary'),
            Stat::make('Released Films', Film::where('status', 'released')->count())
                ->description('Currently released')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),
            Stat::make('Job Applications', JobApplication::count())
                ->description('Pending: ' . JobApplication::where('status', 'submitted')->count())
                ->descriptionIcon('heroicon-m-briefcase')
                ->color('warning'),
            Stat::make('Contact Messages', ContactSubmission::count())
                ->description('Unread: ' . ContactSubmission::where('status', 'new')->count())
                ->descriptionIcon('heroicon-m-envelope')
                ->color('info'),
            Stat::make('News Articles', Post::where('status', 'published')->count())
                ->description('Published posts')
                ->descriptionIcon('heroicon-m-newspaper')
                ->color('primary'),
            Stat::make('Upcoming Projects', Film::whereIn('status', ['pre_production', 'post_production', 'development'])->count())
                ->description('In pipeline')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
        ];
    }
}