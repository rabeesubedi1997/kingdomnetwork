<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteSetting;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\TeamMember;
use App\Models\ModuleSetting;
use App\Models\Genre;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            SiteSettingsSeeder::class,
            MenusSeeder::class,
            TeamMembersSeeder::class,
            GenresSeeder::class,
            ModuleSettingsSeeder::class,
            ContentSeeder::class,
            PujarSarkiSeeder::class,
            DemoFilmImagesSeeder::class,
            KingdomNetworkImagesSeeder::class,
            PagesSeeder::class,
            KingdomNetworkSeeder::class,
            RichDemoContentSeeder::class,
        ]);
    }
}