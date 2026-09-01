<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Film;
use App\Models\FilmAward;
use App\Models\Page;
use App\Models\PageSeo;
use App\Models\Person;
use App\Models\Post;
use App\Models\TeamMember;
use App\Models\SiteSetting;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\ModuleSetting;
use Illuminate\Http\Request;

class SiteController extends Controller
{
    public function show()
    {
        $settings = SiteSetting::publicSettings();
        $allSettings = SiteSetting::pluck('value', 'key')->toArray();
        $brand = config('kingdom.brand');
        $configModules = config('kingdom.modules', []);
        $dbModules = ModuleSetting::orderBy('sort_order')->orderBy('module_name')->get();
        
        $modules = [];
        foreach ($dbModules as $module) {
            $modules[$module->module_name] = $module->is_enabled;
        }
        
        foreach ($configModules as $name => $enabled) {
            if (!isset($modules[$name])) {
                $modules[$name] = $enabled;
            }
        }

        $logoUrl = $allSettings['logo_url'] ?? null;
        $faviconUrl = $allSettings['favicon_url'] ?? config('kingdom.brand.logo.favicon');
        $logoDarkUrl = $allSettings['logo_dark_url'] ?? null;
        $footerLogoUrl = $allSettings['footer_logo_url'] ?? null;

        $pageSeos = PageSeo::all()->keyBy('route');
        $stats = $this->computeStats();

        return response()->json([
            'brand' => $brand,
            'settings' => $settings,
            'stats' => $stats,
            'all_settings' => $allSettings,
            'modules' => $modules,
            'logo_url' => $logoUrl,
            'favicon_url' => $faviconUrl,
            'logo_dark_url' => $logoDarkUrl,
            'footer_logo_url' => $footerLogoUrl,
            'seo' => [
                'default_title' => $allSettings['seo_default_title'] ?? 'Kingdom Network - Redefining Nepali Cinema',
                'title_template' => $allSettings['seo_title_template'] ?? '%s | Kingdom Network',
                'default_description' => $allSettings['seo_default_description'] ?? '',
                'twitter_handle' => $allSettings['seo_twitter_handle'] ?? '@kingdomnetwork',
            ],
            'page_seo' => $pageSeos,
            'analytics' => [
                'ga4_id' => $allSettings['analytics_ga4_id'] ?? '',
                'gtm_id' => $allSettings['analytics_gtm_id'] ?? '',
            ],
        ]);
    }

    /**
     * Real, DB-backed counts for homepage/dynamic-page stat blocks.
     * Replaces the hardcoded, mutually-contradicting figures that used
     * to live directly in the frontend components.
     */
    private function computeStats(): array
    {
        $recognitions = FilmAward::pluck('award_name')
            ->map(fn ($name) => trim(explode(' - ', $name)[0]))
            ->unique()
            ->count();

        return [
            'films' => Film::count(),
            'films_released' => Film::where('status', 'released')->count(),
            'awards_won' => FilmAward::where('result', 'won')->count(),
            'awards_nominated' => FilmAward::where('result', 'nominated')->count(),
            'talent' => TeamMember::count() + Person::count(),
            'recognitions' => $recognitions,
        ];
    }

    public function sitemap()
    {
        $urls = [
            ['loc' => url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => url('/about'), 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['loc' => url('/films'), 'priority' => '0.9', 'changefreq' => 'weekly'],
            ['loc' => url('/news'), 'priority' => '0.7', 'changefreq' => 'daily'],
            ['loc' => url('/careers'), 'priority' => '0.6', 'changefreq' => 'weekly'],
            ['loc' => url('/gallery'), 'priority' => '0.5', 'changefreq' => 'weekly'],
            ['loc' => url('/press'), 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['loc' => url('/contact'), 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['loc' => url('/awards'), 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['loc' => url('/people'), 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['loc' => url('/team'), 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['loc' => url('/privacy'), 'priority' => '0.3', 'changefreq' => 'yearly'],
            ['loc' => url('/terms'), 'priority' => '0.3', 'changefreq' => 'yearly'],
        ];

        foreach (Film::whereNotNull('published_at')->get() as $film) {
            $urls[] = [
                'loc' => url('/films/' . $film->slug),
                'priority' => '0.8',
                'changefreq' => 'monthly',
                'lastmod' => $film->updated_at?->toW3cString(),
            ];
        }

        foreach (Post::where('status', 'published')->get() as $post) {
            $urls[] = [
                'loc' => url('/news/' . $post->slug),
                'priority' => '0.7',
                'changefreq' => 'monthly',
                'lastmod' => $post->updated_at?->toW3cString(),
            ];
        }

        foreach (Person::all() as $person) {
            $urls[] = [
                'loc' => url('/people/' . $person->slug),
                'priority' => '0.5',
                'changefreq' => 'monthly',
            ];
        }

        foreach (Page::where('is_active', true)->get() as $page) {
            $urls[] = [
                'loc' => url('/page/' . $page->slug),
                'priority' => '0.6',
                'changefreq' => 'monthly',
                'lastmod' => $page->updated_at?->toW3cString(),
            ];
        }

        foreach (TeamMember::all() as $member) {
            $urls[] = [
                'loc' => url('/team/' . $member->id),
                'priority' => '0.4',
                'changefreq' => 'monthly',
            ];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        foreach ($urls as $url) {
            $xml .= '<url>';
            $xml .= '<loc>' . e($url['loc']) . '</loc>';
            $xml .= '<lastmod>' . e($url['lastmod'] ?? date('c')) . '</lastmod>';
            $xml .= '<changefreq>' . $url['changefreq'] . '</changefreq>';
            $xml .= '<priority>' . $url['priority'] . '</priority>';
            $xml .= '</url>';
        }
        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    public function robots()
    {
        $content = "User-agent: *\n";
        $content .= "Allow: /\n";
        $content .= "Sitemap: " . url('/sitemap.xml') . "\n";

        return response($content, 200)->header('Content-Type', 'text/plain');
    }

    public function menu(Request $request, string $location)
    {
        $menu = Menu::where('location', $location)->where('is_active', true)->first();

        if (!$menu) {
            return response()->json(['items' => []]);
        }

        $items = $menu->items()
            ->where('is_active', true)
            ->with('children')
            ->orderBy('sort_order')
            ->get()
            ->filter(fn($item) => $item->isVisible())
            ->map(fn($item) => $this->formatMenuItem($item))
            ->values();

        return response()->json(['items' => $items]);
    }

    private function formatMenuItem(MenuItem $item): array
    {
        return [
            'id' => $item->id,
            'label' => $item->label,
            'url' => $item->url,
            'target' => $item->target,
            'module' => $item->module,
            'children' => $item->children
                ->filter(fn($child) => $child->isVisible())
                ->map(fn($child) => $this->formatMenuItem($child))
                ->values()
                ->toArray(),
        ];
    }
}
