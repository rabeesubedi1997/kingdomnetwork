<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Film;

class FilmFactory extends Factory
{
    protected $model = Film::class;

    public function definition(): array
    {
        $statuses = ['released', 'post_production', 'pre_production', 'development', 'announced'];
        $status = $this->faker->randomElement($statuses);
        
        return [
            'slug' => $this->faker->unique()->slug(3),
            'title' => $this->faker->sentence(3),
            'tagline' => $this->faker->optional()->sentence(8),
            'synopsis' => $this->faker->paragraphs(3, true),
            'short_description' => $this->faker->sentence(15),
            'status' => $status,
            'release_date' => $status === 'released' ? $this->faker->dateTimeBetween('-2 years', 'now') : $this->faker->optional()->dateTimeBetween('now', '+2 years'),
            'runtime_minutes' => $this->faker->optional()->numberBetween(80, 180),
            'rating' => $this->faker->optional()->randomElement(['U', 'U/A', 'A', 'PG-13', 'R']),
            'language' => 'Nepali',
            'country' => 'Nepal',
            'budget' => $this->faker->optional()->numberBetween(5000000, 50000000),
            'box_office' => $status === 'released' ? $this->faker->optional()->numberBetween(10000000, 200000000) : null,
            'trailer_url' => $this->faker->optional()->url,
            'is_featured' => $this->faker->boolean(20),
            'sort_order' => $this->faker->numberBetween(0, 100),
            'published_at' => $this->faker->optional()->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function released(): static
    {
        return $this->state(fn() => [
            'status' => 'released',
            'release_date' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'box_office' => $this->faker->numberBetween(10000000, 200000000),
        ]);
    }

    public function upcoming(): static
    {
        return $this->state(fn() => [
            'status' => $this->faker->randomElement(['post_production', 'pre_production', 'development']),
            'release_date' => $this->faker->dateTimeBetween('now', '+2 years'),
        ]);
    }
}