<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
        $faviconUrl = $allSettings['favicon_url'] ?? null;
        $logoDarkUrl = $allSettings['logo_dark_url'] ?? null;

        if ($logoUrl && !str_starts_with($logoUrl, 'http')) {
            $logoUrl = url($logoUrl);
        }
        if ($faviconUrl && !str_starts_with($faviconUrl, 'http')) {
            $faviconUrl = url($faviconUrl);
        }
        if ($logoDarkUrl && !str_starts_with($logoDarkUrl, 'http')) {
            $logoDarkUrl = url($logoDarkUrl);
        }

        return response()->json([
            'brand' => $brand,
            'settings' => $settings,
            'all_settings' => $allSettings,
            'modules' => $modules,
            'logo_url' => $logoUrl,
            'favicon_url' => $faviconUrl,
            'logo_dark_url' => $logoDarkUrl,
            'seo' => [
                'default_title' => $allSettings['seo_default_title'] ?? 'Kingdom Network - Redefining Nepali Cinema',
                'title_template' => $allSettings['seo_title_template'] ?? '%s | Kingdom Network',
                'default_description' => $allSettings['seo_default_description'] ?? '',
                'twitter_handle' => $allSettings['seo_twitter_handle'] ?? '@kingdomnetwork',
            ],
            'analytics' => [
                'ga4_id' => $allSettings['analytics_ga4_id'] ?? '',
                'gtm_id' => $allSettings['analytics_gtm_id'] ?? '',
            ],
        ]);
    }

    public function sitemap()
    {
        $urls = [
            ['loc' => url('/'), 'priority' => '1.0'],
            ['loc' => url('/about'), 'priority' => '0.8'],
            ['loc' => url('/films'), 'priority' => '0.9'],
            ['loc' => url('/news'), 'priority' => '0.7'],
            ['loc' => url('/careers'), 'priority' => '0.6'],
            ['loc' => url('/gallery'), 'priority' => '0.5'],
            ['loc' => url('/press'), 'priority' => '0.6'],
            ['loc' => url('/contact'), 'priority' => '0.7'],
            ['loc' => url('/awards'), 'priority' => '0.6'],
            ['loc' => url('/people'), 'priority' => '0.7'],
            ['loc' => url('/team'), 'priority' => '0.6'],
        ];

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        foreach ($urls as $url) {
            $xml .= '<url>';
            $xml .= '<loc>' . e($url['loc']) . '</loc>';
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
