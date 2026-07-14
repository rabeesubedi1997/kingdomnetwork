<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Post;
use App\Models\User;
use App\Models\Category;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        $statuses = ['draft', 'scheduled', 'published', 'archived'];
        $status = $this->faker->randomElement($statuses);
        
        return [
            'slug' => $this->faker->unique()->slug(4),
            'title' => $this->faker->sentence(6),
            'excerpt' => $this->faker->sentence(20),
            'content' => $this->faker->paragraphs(5, true),
            'author_id' => User::factory(),
            'category_id' => Category::factory(),
            'status' => $status,
            'featured' => $this->faker->boolean(15),
            'reading_time' => $this->faker->numberBetween(3, 15),
            'published_at' => in_array($status, ['published', 'scheduled']) ? $this->faker->dateTimeBetween('-6 months', 'now') : null,
            'seo_title' => $this->faker->optional()->sentence(8),
            'seo_description' => $this->faker->optional()->sentence(15),
            'schema_type' => 'NewsArticle',
        ];
    }

    public function published(): static
    {
        return $this->state(fn() => [
            'status' => 'published',
            'published_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn() => ['featured' => true]);
    }
}