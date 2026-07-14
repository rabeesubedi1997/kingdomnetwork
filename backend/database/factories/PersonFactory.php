<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Person;

class PersonFactory extends Factory
{
    protected $model = Person::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'slug' => $this->faker->unique()->slug(2),
            'role' => $this->faker->randomElement(['Director', 'Actor', 'Producer', 'Writer', 'Cinematographer', 'Editor', 'Composer']),
            'bio' => $this->faker->optional()->paragraphs(2, true),
            'birth_date' => $this->faker->optional()->dateTimeBetween('-70 years', '-20 years'),
            'birth_place' => $this->faker->optional()->city . ', Nepal',
            'imdb_url' => $this->faker->optional()->url,
            'social_links' => $this->faker->optional()->randomElement([
                null,
                ['linkedin' => $this->faker->url, 'twitter' => $this->faker->url, 'instagram' => $this->faker->url],
            ]),
            'is_active' => true,
        ];
    }

    public function director(): static
    {
        return $this->state(fn() => ['role' => 'Director']);
    }

    public function actor(): static
    {
        return $this->state(fn() => ['role' => 'Actor']);
    }
}