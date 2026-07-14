<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Genre;

class GenresSeeder extends Seeder
{
    public function run(): void
    {
        $genres = [
            ['name' => 'Drama', 'slug' => 'drama', 'description' => 'Serious, plot-driven presentations portraying realistic characters', 'color' => '#09333f', 'icon' => '🎭'],
            ['name' => 'Social Drama', 'slug' => 'social-drama', 'description' => 'Films addressing societal issues and social norms', 'color' => '#516f78', 'icon' => '👥'],
            ['name' => 'Action', 'slug' => 'action', 'description' => 'High-energy films with physical stunts and combat', 'color' => '#c10fff', 'icon' => '💥'],
            ['name' => 'Adventure', 'slug' => 'adventure', 'description' => 'Exciting journeys and explorations', 'color' => '#7fa0a1', 'icon' => '🗺️'],
            ['name' => 'Thriller', 'slug' => 'thriller', 'description' => 'Suspenseful plots with tension and excitement', 'color' => '#08313c', 'icon' => '🔍'],
            ['name' => 'Documentary', 'slug' => 'documentary', 'description' => 'Non-fiction films documenting reality', 'color' => '#67768e', 'icon' => '📹'],
            ['name' => 'Historical', 'slug' => 'historical', 'description' => 'Films set in a specific historical period', 'color' => '#ffcd57', 'icon' => '🏛️'],
            ['name' => 'Biography', 'slug' => 'biography', 'description' => 'Life stories of real people', 'color' => '#f2f5f7', 'icon' => '👤'],
        ];

        foreach ($genres as $genre) {
            Genre::updateOrCreate(
                ['slug' => $genre['slug']],
                $genre
            );
        }
    }
}