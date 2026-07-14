<?php

namespace Database\Seeders;

use App\Models\Film;
use App\Models\Person;
use App\Models\Genre;
use App\Models\Post;
use App\Models\PressKit;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PujarSarkiSeeder extends Seeder
{
    public function run(): void
    {
        $dineshRaut = Person::firstOrCreate(
            ['slug' => 'dinesh-raut'],
            [
                'name' => 'Dinesh Raut',
                'role' => 'Director',
                'bio' => 'Acclaimed Nepali film director known for socially relevant cinema.',
                'is_active' => true,
            ]
        );

        $aryanSigdel = Person::firstOrCreate(
            ['slug' => 'aryan-sigdel'],
            [
                'name' => 'Aaryan Sigdel',
                'role' => 'Actor',
                'bio' => 'Popular Nepali actor known for leading roles.',
                'is_active' => true,
            ]
        );

        $pradeepKhadka = Person::firstOrCreate(
            ['slug' => 'pradeep-khadka'],
            [
                'name' => 'Pradeep Khadka',
                'role' => 'Actor',
                'bio' => 'Talented Nepali actor with versatile performances.',
                'is_active' => true,
            ]
        );

        $paulShah = Person::firstOrCreate(
            ['slug' => 'paul-shah'],
            [
                'name' => 'Paul Shah',
                'role' => 'Actor',
                'bio' => 'Well-known Nepali actor and film producer.',
                'is_active' => true,
            ]
        );

        $bikashSubedi = Person::where('slug', 'bikash-subedi')->first();
        $subashBhusal = Person::where('slug', 'subash-bhusal')->first();

        $film = Film::firstOrCreate(
            ['slug' => 'pujar-sarki'],
            [
                'title' => 'Pujar Sarki',
                'tagline' => 'A story of resistance against caste discrimination',
                'synopsis' => 'The story of Pujar Sarki narrates the collective struggle against caste discrimination by three characters in society. A Brahmin priest, a Dalit youth, and a journalist unite to challenge the deep-rooted caste-based social order, facing personal sacrifices and societal backlash in their pursuit of justice and equality.',
                'short_description' => 'A powerful social drama about three individuals uniting against caste discrimination in Nepal.',
                'status' => 'released',
                'release_date' => '2024-05-23',
                'runtime_minutes' => 138,
                'rating' => 'PG',
                'language' => 'Nepali',
                'country' => 'Nepal',
                'box_office' => 73700000,
                'director_id' => $dineshRaut->id,
                'producer_id' => $subashBhusal?->id,
                'writer_id' => $bikashSubedi?->id,
                'is_featured' => true,
                'published_at' => Carbon::now(),
            ]
        );

        $drama = Genre::where('slug', 'drama')->first();
        if ($drama && !$film->genres()->where('genre_id', $drama->id)->exists()) {
            $film->genres()->attach($drama->id);
        }

        PressKit::firstOrCreate(
            ['slug' => 'pujar-sarki-press-kit'],
            [
                'film_id' => $film->id,
                'title' => 'Pujar Sarki Press Kit',
                'logline' => 'A story of resistance against caste discrimination.',
                'synopsis_short' => 'Three individuals unite against caste discrimination in this powerful social drama.',
            ]
        );

        $newsCategory = \App\Models\Category::where('slug', 'film-updates')->first();
        if ($newsCategory) {
            Post::firstOrCreate(
                ['slug' => 'pujar-sarki-kingdom-network-debut-box-office'],
                [
                    'title' => "Pujar Sarki: Kingdom Network's Debut Film Breaks Box Office Records",
                    'content' => '<p>Kingdom Network\'s debut feature film <strong>Pujar Sarki</strong>, directed by Dinesh Raut and written by Bikash Subedi, has taken the Nepali film industry by storm. Released on May 23, 2024, the film grossed over <strong>₹7.37 Crore</strong> at the box office, becoming one of the highest-grossing Nepali films of the year.</p><p>The film tackles the pressing social issue of caste discrimination in Nepal, following three protagonists — a Brahmin priest, a Dalit youth, and a journalist — who unite to challenge the existing caste-based social order. Starring Aaryan Sigdel, Pradeep Khadka, Paul Shah, Anjana Baraili, and Parikshya Limbu, the film received widespread critical acclaim for its bold storytelling and powerful performances.</p><p>Produced by Subash Bhusal under the Kingdom Network banner, Pujar Sarki marks the beginning of a new chapter in Nepali cinema, combining socially relevant themes with commercial appeal.</p>',
                    'excerpt' => "Kingdom Network's debut film Pujar Sarki breaks box office records with ₹7.37 Crore collection.",
                    'category_id' => $newsCategory->id,
                    'status' => 'published',
                    'published_at' => Carbon::now()->subDays(30),
                    'featured' => true,
                ]
            );
        }

        $this->command?->info('Pujar Sarki seeded successfully!');
    }
}
