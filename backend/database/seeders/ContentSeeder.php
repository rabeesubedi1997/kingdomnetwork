<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Film;
use App\Models\Person;
use App\Models\Genre;
use App\Models\Post;
use App\Models\Category;
use App\Models\Job;
use App\Models\Album;
use App\Models\PressKit;
use App\Models\Tag;
use Carbon\Carbon;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $director = Person::create([
            'name' => 'Bikash Subedi',
            'slug' => 'bikash-subedi',
            'role' => 'Director',
            'bio' => 'Accomplished scriptwriter, film director, and music video director known for his work in Nepali cinema.',
            'is_active' => true,
        ]);

        $producer = Person::create([
            'name' => 'Subash Bhusal',
            'slug' => 'subash-bhusal',
            'role' => 'Producer',
            'bio' => 'Distinguished producer and musician in the Nepali entertainment industry.',
            'is_active' => true,
        ]);

        $actor1 = Person::create([
            'name' => 'Anup Bikram Shahi',
            'slug' => 'anup-bikram-shahi',
            'role' => 'Actor',
            'bio' => 'Award-winning Nepali actor known for powerful performances.',
            'is_active' => true,
        ]);

        $actor2 = Person::create([
            'name' => 'Swastima Khadka',
            'slug' => 'swastima-khadka',
            'role' => 'Actor',
            'bio' => 'Popular Nepali actress and model.',
            'is_active' => true,
        ]);

        $drama = Genre::where('slug', 'drama')->first();
        $thriller = Genre::where('slug', 'thriller')->first();
        $comedy = Genre::where('slug', 'comedy')->first();

        $film1 = Film::create([
            'slug' => 'chhadke',
            'title' => 'Chhadke',
            'tagline' => 'A story of resilience and hope',
            'synopsis' => 'A powerful drama that explores the complexities of human relationships against the backdrop of Nepali society. The film follows the journey of a young protagonist navigating through challenges that test their spirit and determination.',
            'short_description' => 'A powerful Nepali drama about resilience and the human spirit.',
            'status' => 'released',
            'release_date' => '2024-03-15',
            'runtime_minutes' => 128,
            'rating' => 'UA',
            'language' => 'Nepali',
            'country' => 'Nepal',
            'director_id' => $director->id,
            'producer_id' => $producer->id,
            'is_featured' => true,
            'published_at' => Carbon::now(),
        ]);

        $film2 = Film::create([
            'slug' => 'farki-herana',
            'title' => 'Farki Herana',
            'tagline' => 'Love beyond boundaries',
            'synopsis' => 'A romantic drama that transcends cultural boundaries and explores the universal language of love. Set against the stunning landscapes of Nepal, this film brings together a compelling narrative with breathtaking cinematography.',
            'short_description' => 'A romantic drama transcending cultural boundaries.',
            'status' => 'post_production',
            'release_date' => '2025-09-20',
            'runtime_minutes' => 142,
            'rating' => 'UA',
            'language' => 'Nepali',
            'country' => 'Nepal',
            'director_id' => $director->id,
            'producer_id' => $producer->id,
            'is_featured' => true,
            'published_at' => Carbon::now(),
        ]);

        $film3 = Film::create([
            'slug' => 'kathmandu-stories',
            'title' => 'Kathmandu Stories',
            'tagline' => 'Every street has a story',
            'synopsis' => 'An anthology film weaving together multiple narratives set in the vibrant streets of Kathmandu. Each story offers a unique perspective on life, love, and the pursuit of dreams in Nepal\'s capital city.',
            'short_description' => 'An anthology of stories set in Kathmandu.',
            'status' => 'development',
            'director_id' => $director->id,
            'producer_id' => $producer->id,
            'is_featured' => false,
            'published_at' => Carbon::now(),
        ]);

        if ($drama) {
            $film1->genres()->attach($drama->id);
            $film2->genres()->attach($drama->id);
        }
        if ($thriller) {
            $film1->genres()->attach($thriller->id);
            $film3->genres()->attach($thriller->id);
        }
        if ($comedy) {
            $film2->genres()->attach($comedy->id);
        }

        $newsCategory = Category::create([
            'name' => 'Film Updates',
            'slug' => 'film-updates',
        ]);

        $awardsCategory = Category::create([
            'name' => 'Awards',
            'slug' => 'awards',
        ]);

        $tag1 = Tag::create(['name' => 'New Release', 'slug' => 'new-release']);
        $tag2 = Tag::create(['name' => 'Behind the Scenes', 'slug' => 'behind-the-scenes']);

        Post::create([
            'title' => 'Chhadke Selected for International Film Festival',
            'slug' => 'chhadke-selected-for-international-film-festival',
            'content' => '<p>We are thrilled to announce that our film <strong>Chhadke</strong> has been officially selected for screening at the upcoming International Film Festival. This recognition marks a significant milestone for Nepali cinema on the global stage.</p><p>The festival will showcase the film alongside other acclaimed international productions, providing a platform for our story to reach a worldwide audience.</p><p>Stay tuned for more updates on the screening schedule and additional festival announcements.</p>',
            'excerpt' => 'Chhadke receives international recognition with official selection at a major film festival.',
            'category_id' => $newsCategory->id,
            'status' => 'published',
            'published_at' => Carbon::now()->subDays(5),
            'featured' => true,
        ]);

        $post2 = Post::create([
            'title' => 'Behind the Scenes: The Making of Farki Herana',
            'slug' => 'behind-the-scenes-farki-herana',
            'content' => '<p>Go behind the scenes of our upcoming film <strong>Farki Herana</strong> as we take you through the creative process that brings this love story to life.</p><p>From location scouting in the scenic hills of Nepal to the intricate choreography of key scenes, our team has been working tirelessly to create a cinematic experience that will captivate audiences.</p><p>The film is currently in post-production and scheduled for release later this year.</p>',
            'excerpt' => 'An exclusive look at the making of our upcoming romantic drama.',
            'category_id' => $newsCategory->id,
            'status' => 'published',
            'published_at' => Carbon::now()->subDays(2),
            'featured' => true,
        ]);

        $post2->tags()->attach([$tag1->id, $tag2->id]);

        Post::create([
            'title' => 'Kingdom Network Wins Best Production Company Award',
            'slug' => 'kingdom-network-wins-best-production-company',
            'content' => '<p>Kingdom Network has been honored with the <strong>Best Production Company</strong> award at the National Film Awards 2025.</p><p>This recognition reflects our commitment to producing high-quality films that showcase the best of Nepali storytelling talent. We extend our gratitude to our dedicated team, partners, and audiences who make this journey possible.</p>',
            'excerpt' => 'Kingdom Network recognized as Best Production Company at National Film Awards.',
            'category_id' => $awardsCategory->id,
            'status' => 'published',
            'published_at' => Carbon::now()->subDays(10),
            'featured' => false,
        ]);

        Job::create([
            'title' => 'Junior Video Editor',
            'slug' => 'junior-video-editor',
            'description' => 'We are looking for a talented Junior Video Editor to join our post-production team. You will work on film projects, promotional content, and behind-the-scenes materials.',
            'requirements' => '<ul><li>Proficiency in Adobe Premiere Pro and DaVinci Resolve</li><li>Understanding of color grading and sound design</li><li>Portfolio demonstrating editing skills</li><li>Ability to work in a team environment</li></ul>',
            'benefits' => '<ul><li>Competitive salary</li><li>Opportunity to work on feature films</li><li>Professional development opportunities</li><li>Flexible working hours</li></ul>',
            'department' => 'Post-Production',
            'location' => 'Kathmandu, Nepal',
            'type' => 'full_time',
            'salary_range' => 'Negotiable',
            'is_remote' => false,
            'is_open' => true,
        ]);

        Job::create([
            'title' => 'Marketing Coordinator',
            'slug' => 'marketing-coordinator',
            'description' => 'Join our marketing team to coordinate promotional campaigns for our film releases. You will manage social media, organize events, and work with media partners.',
            'requirements' => '<ul><li>Bachelor\'s degree in Marketing or related field</li><li>2+ years experience in marketing or communications</li><li>Excellent written and verbal communication skills</li><li>Experience with social media management tools</li></ul>',
            'benefits' => '<ul><li>Competitive compensation package</li><li>Film festival access</li><li>Creative work environment</li><li>Career growth opportunities</li></ul>',
            'department' => 'Marketing',
            'location' => 'Kathmandu, Nepal',
            'type' => 'full_time',
            'salary_range' => 'Negotiable',
            'is_remote' => false,
            'is_open' => true,
        ]);

        Album::create([
            'title' => 'Behind the Scenes',
            'slug' => 'behind-the-scenes',
            'description' => 'A curated collection from our productions.',
            'category' => 'behind_the_scenes',
            'is_public' => true,
        ]);

        Album::create([
            'title' => 'Festival Highlights',
            'slug' => 'festival-highlights',
            'description' => 'Moments from premieres and screenings.',
            'category' => 'events',
            'is_public' => true,
        ]);

        PressKit::create([
            'film_id' => $film1->id,
            'title' => 'Chhadke Press Kit',
            'slug' => 'chhadke-press-kit',
            'logline' => 'A story of resilience and hope.',
            'synopsis_short' => 'A powerful Nepali drama about resilience and the human spirit.',
        ]);

        PressKit::create([
            'film_id' => $film2->id,
            'title' => 'Farki Herana Press Kit',
            'slug' => 'farki-herana-press-kit',
            'logline' => 'Love beyond boundaries.',
            'synopsis_short' => 'A romantic drama transcending cultural boundaries.',
        ]);

        // Pujar Sarki - Kingdom Network's debut feature
        $dineshRaut = Person::create([
            'name' => 'Dinesh Raut',
            'slug' => 'dinesh-raut',
            'role' => 'Director',
            'bio' => 'Acclaimed Nepali film director known for socially relevant cinema.',
            'is_active' => true,
        ]);

        $aryanSigdel = Person::create([
            'name' => 'Aaryan Sigdel',
            'slug' => 'aryan-sigdel',
            'role' => 'Actor',
            'bio' => 'Popular Nepali actor known for leading roles.',
            'is_active' => true,
        ]);

        $pradeepKhadka = Person::create([
            'name' => 'Pradeep Khadka',
            'slug' => 'pradeep-khadka',
            'role' => 'Actor',
            'bio' => 'Talented Nepali actor with versatile performances.',
            'is_active' => true,
        ]);

        $paulShah = Person::create([
            'name' => 'Paul Shah',
            'slug' => 'paul-shah',
            'role' => 'Actor',
            'bio' => 'Well-known Nepali actor and film producer.',
            'is_active' => true,
        ]);

        $film4 = Film::create([
            'slug' => 'pujar-sarki',
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
            'producer_id' => $producer->id,
            'writer_id' => $director->id, // Bikash Subedi wrote it
            'is_featured' => true,
            'published_at' => Carbon::now(),
        ]);

        $socialDrama = Genre::where('slug', 'drama')->first();
        if ($socialDrama) {
            $film4->genres()->attach($socialDrama->id);
        }

        PressKit::create([
            'film_id' => $film4->id,
            'title' => 'Pujar Sarki Press Kit',
            'slug' => 'pujar-sarki-press-kit',
            'logline' => 'A story of resistance against caste discrimination.',
            'synopsis_short' => 'Three individuals unite against caste discrimination in this powerful social drama.',
        ]);

        Post::create([
            'title' => 'Pujar Sarki: Kingdom Network\'s Debut Film Breaks Box Office Records',
            'slug' => 'pujar-sarki-kingdom-network-debut-box-office',
            'content' => '<p>Kingdom Network\'s debut feature film <strong>Pujar Sarki</strong>, directed by Dinesh Raut and written by Bikash Subedi, has taken the Nepali film industry by storm. Released on May 23, 2024, the film grossed over <strong>₹7.37 Crore</strong> at the box office, becoming one of the highest-grossing Nepali films of the year.</p><p>The film tackles the pressing social issue of caste discrimination in Nepal, following three protagonists — a Brahmin priest, a Dalit youth, and a journalist — who unite to challenge the existing caste-based social order. Starring Aaryan Sigdel, Pradeep Khadka, Paul Shah, Anjana Baraili, and Parikshya Limbu, the film received widespread critical acclaim for its bold storytelling and powerful performances.</p><p>Produced by Subash Bhusal under the Kingdom Network banner, Pujar Sarki marks the beginning of a new chapter in Nepali cinema, combining socially relevant themes with commercial appeal.</p>',
            'excerpt' => 'Kingdom Network\'s debut film Pujar Sarki breaks box office records with ₹7.37 Crore collection.',
            'category_id' => $newsCategory->id,
            'status' => 'published',
            'published_at' => Carbon::now()->subDays(30),
            'featured' => true,
        ]);
    }
}
