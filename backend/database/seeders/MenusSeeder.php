<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;
use App\Models\MenuItem;

class MenusSeeder extends Seeder
{
    public function run(): void
    {
        // Main Navigation Menu
        $mainMenu = Menu::updateOrCreate(
            ['location' => 'main'],
            ['name' => 'Main Navigation', 'location' => 'main', 'is_active' => true]
        );

        $mainItems = [
            ['label' => 'Home', 'url' => '/', 'sort_order' => 1, 'module' => 'core'],
            ['label' => 'Films', 'url' => '/films', 'sort_order' => 2, 'module' => 'films'],
            ['label' => 'About', 'url' => '/about', 'sort_order' => 3, 'module' => 'core'],
            ['label' => 'News', 'url' => '/news', 'sort_order' => 4, 'module' => 'news'],
            ['label' => 'Gallery', 'url' => '/gallery', 'sort_order' => 5, 'module' => 'gallery'],
            ['label' => 'Press', 'url' => '/press', 'sort_order' => 6, 'module' => 'press_kit'],
            ['label' => 'Careers', 'url' => '/careers', 'sort_order' => 7, 'module' => 'careers'],
            ['label' => 'Contact', 'url' => '/contact', 'sort_order' => 8, 'module' => 'core'],
        ];

        foreach ($mainItems as $index => $item) {
            MenuItem::updateOrCreate(
                ['menu_id' => $mainMenu->id, 'label' => $item['label']],
                ['parent_id' => null, ...$item, 'target' => '_self', 'is_active' => true]
            );
        }

        // Footer Menu
        $footerMenu = Menu::updateOrCreate(
            ['location' => 'footer'],
            ['name' => 'Footer Navigation', 'location' => 'footer', 'is_active' => true]
        );

        $footerItems = [
            ['label' => 'About Us', 'url' => '/about', 'sort_order' => 1, 'module' => 'core'],
            ['label' => 'Films', 'url' => '/films', 'sort_order' => 2, 'module' => 'films'],
            ['label' => 'News', 'url' => '/news', 'sort_order' => 3, 'module' => 'news'],
            ['label' => 'Careers', 'url' => '/careers', 'sort_order' => 4, 'module' => 'careers'],
            ['label' => 'Gallery', 'url' => '/gallery', 'sort_order' => 5, 'module' => 'gallery'],
            ['label' => 'Press', 'url' => '/press', 'sort_order' => 6, 'module' => 'press_kit'],
            ['label' => 'Contact', 'url' => '/contact', 'sort_order' => 7, 'module' => 'core'],
        ];

        foreach ($footerItems as $item) {
            MenuItem::updateOrCreate(
                ['menu_id' => $footerMenu->id, 'label' => $item['label']],
                ['parent_id' => null, ...$item, 'target' => '_self', 'is_active' => true]
            );
        }

        // Legal Footer Menu
        $legalMenu = Menu::updateOrCreate(
            ['location' => 'footer-legal'],
            ['name' => 'Footer Legal', 'location' => 'footer-legal', 'is_active' => true]
        );

        $legalItems = [
            ['label' => 'Privacy Policy', 'url' => '/privacy', 'sort_order' => 1, 'module' => 'core'],
            ['label' => 'Terms of Service', 'url' => '/terms', 'sort_order' => 2, 'module' => 'core'],
        ];

        foreach ($legalItems as $item) {
            MenuItem::updateOrCreate(
                ['menu_id' => $legalMenu->id, 'label' => $item['label']],
                ['parent_id' => null, ...$item, 'target' => '_self', 'is_active' => true]
            );
        }
    }
}