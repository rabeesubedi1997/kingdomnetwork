<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ModuleSetting;

class ModuleSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            ['module_name' => 'core', 'is_enabled' => true, 'config' => []],
            ['module_name' => 'films', 'is_enabled' => true, 'config' => ['per_page' => 12, 'featured_limit' => 6]],
            ['module_name' => 'news', 'is_enabled' => true, 'config' => ['per_page' => 12, 'featured_limit' => 3]],
            ['module_name' => 'careers', 'is_enabled' => true, 'config' => ['per_page' => 20]],
            ['module_name' => 'gallery', 'is_enabled' => true, 'config' => ['per_page' => 24]],
            ['module_name' => 'press_kit', 'is_enabled' => true, 'config' => []],
            ['module_name' => 'newsletter', 'is_enabled' => true, 'config' => ['double_opt_in' => true]],
            ['module_name' => 'shop', 'is_enabled' => false, 'config' => ['provider' => 'shopify']],
            ['module_name' => 'membership', 'is_enabled' => false, 'config' => ['tiers' => ['basic', 'premium', 'vip']]],
            ['module_name' => 'events', 'is_enabled' => false, 'config' => []],
            ['module_name' => 'podcasts', 'is_enabled' => false, 'config' => []],
            ['module_name' => 'tv', 'is_enabled' => false, 'config' => []],
            ['module_name' => 'comics', 'is_enabled' => false, 'config' => []],
            ['module_name' => 'screening', 'is_enabled' => false, 'config' => []],
            ['module_name' => 'investors', 'is_enabled' => false, 'config' => []],
            ['module_name' => 'seo_sitemap', 'is_enabled' => true, 'config' => ['auto_generate' => true]],
        ];

        foreach ($modules as $module) {
            ModuleSetting::updateOrCreate(
                ['module_name' => $module['module_name']],
                $module
            );
        }
    }
}