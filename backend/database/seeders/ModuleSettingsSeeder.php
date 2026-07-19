<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ModuleSetting;

class ModuleSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            ['module_name' => 'core', 'is_enabled' => true, 'config' => [], 'sort_order' => 1],
            ['module_name' => 'films', 'is_enabled' => true, 'config' => ['per_page' => 12, 'featured_limit' => 6], 'sort_order' => 2],
            ['module_name' => 'news', 'is_enabled' => true, 'config' => ['per_page' => 12, 'featured_limit' => 3], 'sort_order' => 3],
            ['module_name' => 'careers', 'is_enabled' => true, 'config' => ['per_page' => 20], 'sort_order' => 6],
            ['module_name' => 'gallery', 'is_enabled' => true, 'config' => ['per_page' => 24], 'sort_order' => 4],
            ['module_name' => 'press_kit', 'is_enabled' => true, 'config' => [], 'sort_order' => 7],
            ['module_name' => 'newsletter', 'is_enabled' => true, 'config' => ['double_opt_in' => true], 'sort_order' => 5],
            ['module_name' => 'shop', 'is_enabled' => false, 'config' => ['provider' => 'shopify'], 'sort_order' => 8],
            ['module_name' => 'membership', 'is_enabled' => false, 'config' => ['tiers' => ['basic', 'premium', 'vip']], 'sort_order' => 9],
            ['module_name' => 'events', 'is_enabled' => false, 'config' => [], 'sort_order' => 10],
            ['module_name' => 'podcasts', 'is_enabled' => false, 'config' => [], 'sort_order' => 11],
            ['module_name' => 'tv', 'is_enabled' => false, 'config' => [], 'sort_order' => 12],
            ['module_name' => 'comics', 'is_enabled' => false, 'config' => [], 'sort_order' => 13],
            ['module_name' => 'screening', 'is_enabled' => false, 'config' => [], 'sort_order' => 14],
            ['module_name' => 'investors', 'is_enabled' => false, 'config' => [], 'sort_order' => 15],
            ['module_name' => 'seo_sitemap', 'is_enabled' => true, 'config' => ['auto_generate' => true], 'sort_order' => 16],
            ['module_name' => 'awards', 'is_enabled' => true, 'config' => ['per_page' => 20], 'sort_order' => 17],
            ['module_name' => 'people', 'is_enabled' => true, 'config' => ['per_page' => 20], 'sort_order' => 18],
            ['module_name' => 'search', 'is_enabled' => true, 'config' => ['limit' => 10], 'sort_order' => 19],
        ];

        foreach ($modules as $module) {
            ModuleSetting::updateOrCreate(
                ['module_name' => $module['module_name']],
                $module
            );
        }
    }
}