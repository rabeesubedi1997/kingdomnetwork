<?php

namespace App\Providers;

use App\Filament\Resources\AlbumResource;
use App\Filament\Resources\FilmResource;
use App\Filament\Resources\GenreResource;
use App\Filament\Resources\JobResource;
use App\Filament\Resources\PersonResource;
use App\Filament\Resources\PostResource;
use App\Filament\Resources\PressKitResource;
use App\Filament\Resources\SiteSettingResource;
use App\Filament\Resources\TeamMemberResource;
use App\Filament\Widgets\RecentApplications;
use App\Filament\Widgets\RecentFilms;
use App\Filament\Widgets\StatsOverview;
use Filament\Navigation\NavigationBuilder;
use Filament\Navigation\NavigationGroup;
use Filament\Navigation\NavigationItem;
use Filament\Panel;
use Filament\PanelProvider;
use Illuminate\Support\Facades\Config;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        $enabledModules = Config::get('kingdom.modules', []);

        return $panel
            ->id('admin')
            ->path('admin')
            ->login()
            ->colors([
                'primary' => Config::get('kingdom.brand.colors.primary'),
                'secondary' => Config::get('kingdom.brand.colors.secondary'),
                'success' => Config::get('kingdom.brand.colors.gold'),
                'danger' => '#dc2626',
            ])
            ->font('Inter')
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                \App\Filament\Pages\Dashboard::class,
            ])
            ->widgets([
                StatsOverview::class,
                RecentFilms::class,
                RecentApplications::class,
            ])
            ->navigation(function (NavigationBuilder $builder) use ($enabledModules): NavigationBuilder {
                $groups = [];

                // Core group - always visible
                $groups[] = NavigationGroup::make('Core')
                    ->items([
                        NavigationItem::make('Dashboard')
                            ->icon('heroicon-o-home')
                            ->url('/admin'),
                        NavigationItem::make('Site Settings')
                            ->icon('heroicon-o-cog-6-tooth')
                            ->url('/admin/site-settings'),
                        NavigationItem::make('Menus')
                            ->icon('heroicon-o-bars-3')
                            ->url('/admin/menus'),
                        NavigationItem::make('Pages')
                            ->icon('heroicon-o-document-text')
                            ->url('/admin/pages'),
                        NavigationItem::make('Team Members')
                            ->icon('heroicon-o-user-group')
                            ->url('/admin/team-members'),
                        NavigationItem::make('Contact Submissions')
                            ->icon('heroicon-o-envelope')
                            ->url('/admin/contact-submissions'),
                    ]);

                // Films group
                if ($enabledModules['films']) {
                    $groups[] = NavigationGroup::make('Films')
                        ->items([
                            NavigationItem::make('Films')
                                ->icon('heroicon-o-film')
                                ->url('/admin/films'),
                            NavigationItem::make('People')
                                ->icon('heroicon-o-user')
                                ->url('/admin/people'),
                            NavigationItem::make('Genres')
                                ->icon('heroicon-o-tag')
                                ->url('/admin/genres'),
                        ]);
                }

                // Content group
                $contentItems = [];
                if ($enabledModules['news']) {
                    $contentItems[] = NavigationItem::make('News')
                        ->icon('heroicon-o-newspaper')
                        ->url('/admin/posts');
                }
                if ($enabledModules['events']) {
                    $contentItems[] = NavigationItem::make('Events')
                        ->icon('heroicon-o-calendar-days')
                        ->url('/admin/events');
                }
                if ($enabledModules['gallery']) {
                    $contentItems[] = NavigationItem::make('Gallery')
                        ->icon('heroicon-o-photo')
                        ->url('/admin/albums');
                }
                if ($enabledModules['press_kit']) {
                    $contentItems[] = NavigationItem::make('Press Kits')
                        ->icon('heroicon-o-document-text')
                        ->url('/admin/press-kits');
                }

                if (count($contentItems) > 0) {
                    $groups[] = NavigationGroup::make('Content')
                        ->items($contentItems);
                }

                // Careers
                if ($enabledModules['careers']) {
                    $groups[] = NavigationGroup::make('Careers')
                        ->items([
                            NavigationItem::make('Job Listings')
                                ->icon('heroicon-o-briefcase')
                                ->url('/admin/jobs'),
                        ]);
                }

                // Commerce
                if ($enabledModules['shop']) {
                    $groups[] = NavigationGroup::make('Commerce')
                        ->items([
                            NavigationItem::make('Products')
                                ->icon('heroicon-o-shopping-bag')
                                ->url('/admin/products'),
                            NavigationItem::make('Orders')
                                ->icon('heroicon-o-shopping-cart')
                                ->url('/admin/orders'),
                        ]);
                }

                // Community
                $communityItems = [];
                if ($enabledModules['newsletter']) {
                    $communityItems[] = NavigationItem::make('Newsletter')
                        ->icon('heroicon-o-envelope')
                        ->url('/admin/newsletter');
                }
                if ($enabledModules['membership']) {
                    $communityItems[] = NavigationItem::make('Members')
                        ->icon('heroicon-o-users')
                        ->url('/admin/members');
                }

                if (count($communityItems) > 0) {
                    $groups[] = NavigationGroup::make('Community')
                        ->items($communityItems);
                }

                // Business
                $businessItems = [];
                if ($enabledModules['screening']) {
                    $businessItems[] = NavigationItem::make('Screenings')
                        ->icon('heroicon-o-ticket')
                        ->url('/admin/screenings');
                }
                if ($enabledModules['investors']) {
                    $businessItems[] = NavigationItem::make('Investors')
                        ->icon('heroicon-o-banknotes')
                        ->url('/admin/investors');
                }

                if (count($businessItems) > 0) {
                    $groups[] = NavigationGroup::make('Business')
                        ->items($businessItems);
                }

                return $builder->groups($groups);
            });
    }
}