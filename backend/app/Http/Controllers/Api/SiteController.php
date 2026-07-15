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

        return response()->json([
            'brand' => $brand,
            'settings' => $settings,
            'modules' => $modules,
        ]);
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
