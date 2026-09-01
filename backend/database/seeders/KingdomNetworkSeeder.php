<?php

namespace Database\Seeders;

use App\Models\Film;
use App\Models\Person;
use App\Models\Genre;
use App\Models\FilmAward;
use App\Models\Post;
use App\Models\Category;
use App\Models\FilmCast;
use App\Models\FilmCrew;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class KingdomNetworkSeeder extends Seeder
{
    public function run(): void
    {
        $this->addPeople();
        $this->addGenres();
        $this->addFractureFilm();
        $this->addShirjaraFilm();
        $this->addPujarSarkiAwards();
        $this->addNewsArticles();
        $this->command?->info('Kingdom Network content seeded successfully!');
    }

    private function addPeople(): void
    {
        $people = [
            ['slug' => 'ryan-travis', 'name' => 'Ryan Travis', 'role' => 'Director', 'bio' => 'American film director known for Fracture.', 'is_active' => true],
            ['slug' => 'trenton-rostedt', 'name' => 'Trenton Rostedt', 'role' => 'Actor', 'bio' => 'Hollywood actor starring in international co-productions.', 'is_active' => true],
            ['slug' => 'anita-pandit', 'name' => 'Anita Pandit', 'role' => 'Actor', 'bio' => 'Nepali actress featuring in international films.', 'is_active' => true],
            ['slug' => 'buddhi-tamang', 'name' => 'Buddhi Tamang', 'role' => 'Actor', 'bio' => 'Experienced Nepali actor.', 'is_active' => true],
            ['slug' => 'ashish-purush', 'name' => 'Ashish Purush', 'role' => 'Actor', 'bio' => 'Nepali actor.', 'is_active' => true],
            ['slug' => 'mahesh-tripathi', 'name' => 'Mahesh Tripathi', 'role' => 'Actor', 'bio' => 'Nepali actor.', 'is_active' => true],
            ['slug' => 'chris-beyrooty', 'name' => 'Chris Beyrooty', 'role' => 'Writer', 'bio' => 'American screenwriter and executive producer.', 'is_active' => true],
            ['slug' => 'michele-coggiola', 'name' => 'Michele Coggiola', 'role' => 'Writer', 'bio' => 'Screenwriter.', 'is_active' => true],
            ['slug' => 'luanabajrami', 'name' => 'Luana Bajrami', 'role' => 'Actor', 'bio' => 'Kosovo-born actress starring in Shirjara.', 'is_active' => true],
            ['slug' => 'rajesh-shrestha-cinematographer', 'name' => 'Rajesh Shrestha', 'role' => 'Cinematographer', 'bio' => 'Nepali cinematographer.', 'is_active' => true],
            ['slug' => 'bharat-regmi', 'name' => 'Bharat Regmi', 'role' => 'Editor', 'bio' => 'Nepali film editor.', 'is_active' => true],
        ];

        foreach ($people as $data) {
            Person::firstOrCreate(['slug' => $data['slug']], $data);
        }
    }

    private function addGenres(): void
    {
        Genre::firstOrCreate(
            ['slug' => 'psychological-thriller'],
            ['name' => 'Psychological Thriller', 'description' => 'Films exploring psychological tension and suspense', 'color' => '#1a1a2e', 'icon' => '🧠']
        );
    }

    private function addFractureFilm(): void
    {
        $director = Person::where('slug', 'ryan-travis')->first();
        $writer1 = Person::where('slug', 'chris-beyrooty')->first();
        $writer2 = Person::where('slug', 'michele-coggiola')->first();
        $producer = Person::where('slug', 'subash-bhusal')->first();
        $aryanSigdel = Person::where('slug', 'aryan-sigdel')->first();

        $film = Film::firstOrCreate(
            ['slug' => 'fracture'],
            [
                'title' => 'Fracture',
                'tagline' => 'Some bonds break mountains',
                'synopsis' => 'A decorated veteran ventures into the perilous Himalayas, battling the deadly mountains and ruthless foes, to rescue his missing friend from the clutches of the Scorpion Cartel, who are coercing Sherpas into dangerous drug drops. As he navigates treacherous terrain and uncovers a sinister conspiracy, he must confront both the elements and the relentless cartel to bring his friend home.',
                'short_description' => 'A psychological thriller set in the Himalayas about a veteran on a rescue mission.',
                'status' => 'post_production',
                'release_date' => null,
                'runtime_minutes' => null,
                'rating' => null,
                'language' => 'English',
                'country' => 'Nepal, United States',
                'director_id' => $director?->id,
                'producer_id' => $producer?->id,
                'writer_id' => $writer1?->id,
                'is_featured' => false,
                'published_at' => Carbon::now(),
            ]
        );

        $thriller = Genre::where('slug', 'psychological-thriller')->first();
        if ($thriller && !$film->genres()->where('genre_id', $thriller->id)->exists()) {
            $film->genres()->attach($thriller->id);
        }
        $action = Genre::where('slug', 'action')->first();
        if ($action && !$film->genres()->where('genre_id', $action->id)->exists()) {
            $film->genres()->attach($action->id);
        }
        $adventure = Genre::where('slug', 'adventure')->first();
        if ($adventure && !$film->genres()->where('genre_id', $adventure->id)->exists()) {
            $film->genres()->attach($adventure->id);
        }
    }

    private function addShirjaraFilm(): void
    {
        $director = Person::where('slug', 'bikash-subedi')->first();
        $producer = Person::where('slug', 'subash-bhusal')->first();
        $writer = Person::where('slug', 'bikash-subedi')->first();

        $film = Film::firstOrCreate(
            ['slug' => 'shirjara-song-of-grandmother'],
            [
                'title' => 'Shirjara: Song of Grandmother',
                'tagline' => 'Where ancient songs hold more power than algorithms',
                'synopsis' => 'Lured back to the Himalayas to grant her grandmother\'s dying wish, a disconnected AI engineer finds her ancestor\'s land where ancient songs hold more power than algorithms, and death is a final return to the root. A metamodern exploration of the synthesis between the Digital Cloud and the Dust of Ancestors.',
                'short_description' => 'A meta-modern philosophical drama about an AI engineer who returns to the Himalayas.',
                'status' => 'development',
                'release_date' => null,
                'runtime_minutes' => null,
                'rating' => 'G',
                'language' => 'Nepali, English',
                'country' => 'Nepal, United States, Poland',
                'director_id' => $director?->id,
                'producer_id' => $producer?->id,
                'writer_id' => $writer?->id,
                'is_featured' => false,
                'published_at' => Carbon::now(),
            ]
        );

        $drama = Genre::where('slug', 'drama')->first();
        if ($drama && !$film->genres()->where('genre_id', $drama->id)->exists()) {
            $film->genres()->attach($drama->id);
        }
    }

    private function addPujarSarkiAwards(): void
    {
        $film = Film::where('slug', 'pujar-sarki')->first();
        if (!$film) return;

        $bharatRegmi = Person::where('slug', 'bharat-regmi')->first();
        $dineshRaut = Person::where('slug', 'dinesh-raut')->first();
        $rajeshShrestha = Person::where('slug', 'rajesh-shrestha-cinematographer')->first();

        $awards = [
            [
                'award_name' => 'National Film Award 2081 - Best Editor',
                'category' => 'Best Editor',
                'year' => 2025,
                'result' => 'won',
                'notes' => 'Bharat Regmi won Best Editor at the National Film Awards 2081.',
            ],
            [
                'award_name' => 'NIFF Awards 2025 - Best Director',
                'category' => 'Best Director',
                'year' => 2025,
                'result' => 'won',
                'notes' => 'Dinesh Raut won Best Director at NIFF Awards 2025.',
            ],
            [
                'award_name' => 'NIFF Awards 2025 - Best Actress',
                'category' => 'Best Actor in a Leading Role (Female)',
                'year' => 2025,
                'result' => 'won',
                'notes' => 'Anjana Baraili won Best Actress at NIFF Awards 2025.',
            ],
            [
                'award_name' => 'NIFF Awards 2025 - Best Cinematographer',
                'category' => 'Best Cinematographer',
                'year' => 2025,
                'result' => 'won',
                'notes' => 'Rajesh Shrestha won Best Cinematographer at NIFF Awards 2025.',
            ],
            [
                'award_name' => 'Golden Nepali Film Award 2024 - Best Film',
                'category' => 'Best Film',
                'year' => 2024,
                'result' => 'won',
                'notes' => 'Pujar Sarki won Best Film at the inaugural Golden Nepali Film Award 2024 in California, USA.',
            ],
            [
                'award_name' => 'Golden Nepali Film Award 2024 - Best Director',
                'category' => 'Best Director',
                'year' => 2024,
                'result' => 'won',
                'notes' => 'Dinesh Raut won Best Director at Golden Nepali Film Award 2024.',
            ],
        ];

        foreach ($awards as $data) {
            FilmAward::firstOrCreate(
                ['film_id' => $film->id, 'award_name' => $data['award_name']],
                $data
            );
        }
    }

    private function addNewsArticles(): void
    {
        $category = Category::where('slug', 'film-updates')->first();
        if (!$category) return;

        Post::updateOrCreate(
            ['slug' => 'kingdom-network-announces-fracture'],
            [
                'title' => "Kingdom Network Produces 'Fracture' – A Nepal-US Co-production Starring Aaryan Sigdel",
                'content' => '<p>After the massive success of <strong>Pujar Sarki</strong>, Kingdom Network has produced its second film, <strong>Fracture</strong>, directed by renowned American director Ryan Travis. The movie is entirely in English and marks the company\'s first international co-production.</p><p>Nepali actor Aaryan Sigdel stars alongside Hollywood actor Trenton Rostedt in the leading roles. The film also features several Nepali actors, including Buddhi Tamang, Ashish Purush, Anita Pandit, and Gunraj Shrestha.</p><p>Approximately 70% of the film was shot in Nepal across stunning locations including Kathmandu, Lalitpur, Bhaktapur, Panauti, Lukla and up to Everest Base Camp. The storyline follows American soldier Jack Stanton on a perilous journey in the Everest region to rescue a missing friend.</p><p>Producer Subash Bhusal shared that the film was produced after Kingdom Network was recently established in the United States. Chris Beyrooty served as executive producer, with mountaineering expert Andrew Hughes and two-time Emmy Award-winning producer Garrett Madison also involved. The release date for Fracture has not yet been set, but discussions are underway for a global release.</p>',
                'excerpt' => 'Kingdom Network produces second film Fracture, a Nepal-US co-production directed by Ryan Travis.',
                'category_id' => $category->id,
                'status' => 'published',
                'published_at' => Carbon::now()->subDays(15),
                'featured' => true,
            ]
        );

        Post::updateOrCreate(
            ['slug' => 'shirjara-song-of-grandmother-announced'],
            [
                'title' => "Bikash Subedi's Directorial Debut 'Shirjara: Song of Grandmother' to be Nepal-Poland-USA Co-production",
                'content' => '<p>Writer Bikash Subedi is set to make his directorial debut with <strong>Shirjara: Song of Grandmother</strong>, a meta-modern philosophical drama produced as a joint venture between Nepal, the United States, and Poland.</p><p>Nepal\'s Kingdom Network, America\'s Fracture LLC, and Poland\'s Fikza Films will collaborate on the production. The film will be produced by Subash Bhusal (Nepal) with Chris Beyrooty (USA) serving as executive producer. Post-production work will take place in Poland, with Kosovo-born actress Luana Bajrami and Nepali actor Mahesh Tripathi attached to star.</p><p>The story follows an AI engineer who returns to the Himalayas to fulfill her grandmother\'s dying wish, discovering a world where ancient songs hold more power than algorithms. The film is currently in pre-production with shooting scheduled to begin in February 2026.</p>',
                'excerpt' => 'Bikash Subedi directs his debut feature Shirjara as a Nepal-Poland-USA co-production.',
                'category_id' => $category->id,
                'status' => 'published',
                'published_at' => Carbon::now()->subDays(5),
                'featured' => true,
            ]
        );

        Post::updateOrCreate(
            ['slug' => 'pujar-sarki-wins-national-film-award'],
            [
                'title' => "Pujar Sarki Wins Best Editor at National Film Awards 2081",
                'content' => '<p><strong>Pujar Sarki</strong>, Kingdom Network\'s debut feature, continues its award-winning streak. Editor Bharat Regmi won the <strong>Best Editor</strong> award at the prestigious National Film Awards 2081, held at the President\'s residence in Kathmandu.</p><p>Earlier, the film had already won three awards at the Nepal International Film Festival (NIFF) Awards 2025, including Best Director for Dinesh Raut, Best Actress for Anjana Baraili, and Best Cinematographer for Rajesh Shrestha. The film was also declared <strong>Best Film</strong> at the inaugural Golden Nepali Film Award 2024 held in California, USA.</p><p>With a box office collection of over ₹7.37 Crore, Pujar Sarki stands as one of the highest-grossing Nepali films and a landmark achievement for socially conscious cinema in Nepal.</p>',
                'excerpt' => "Pujar Sarki wins Best Editor at National Film Awards 2081, adding to its growing list of accolades.",
                'category_id' => $category->id,
                'status' => 'published',
                'published_at' => Carbon::now()->subDays(2),
                'featured' => false,
            ]
        );

        Post::firstOrCreate(
            ['slug' => 'pujar-sarki-now-on-youtube'],
            [
                'title' => 'Pujar Sarki Now Available for Free on YouTube – Watch the Full Film Online',
                'content' => '<p><strong>Pujar Sarki</strong>, Kingdom Network\'s debut feature and one of the highest-grossing Nepali films of 2024, is now available to watch for free on YouTube. The full movie has been officially uploaded by the makers on the OSR Digital YouTube channel, making it accessible to audiences worldwide without any subscription or payment.</p><p>The film, directed by Dinesh Raut and written by Bikash Subedi, tells the powerful story of three individuals uniting against caste discrimination in Nepali society. Starring Aaryan Sigdel, Pradeep Khadka, Paul Shah, Anjana Baraili, and Parikshya Limbu, the 138-minute feature earned over ₹7.37 Crore at the box office during its theatrical run.</p><p>The film is also available for streaming on VideoPasal app and CinemaGhar OTT platform for viewers who prefer ad-free experiences. This YouTube release opens the film to an even wider global audience, furthering its message of social justice and equality.</p>',
                'excerpt' => 'Pujar Sarki is now available to watch for free on YouTube, reaching a wider global audience.',
                'category_id' => $category->id,
                'status' => 'published',
                'published_at' => Carbon::now()->subDays(7),
                'featured' => false,
            ]
        );

        Post::firstOrCreate(
            ['slug' => 'kingdom-network-malaysia-ambassador-meeting'],
            [
                'title' => 'Kingdom Network Meets Malaysian Ambassador to Explore Cultural Film Collaboration',
                'content' => '<p>Kingdom Network had the distinct honor of a productive briefing session with H.E. Mohd Firdaus bin Azman, Ambassador of Malaysia to Nepal. The dialogue centered on the profound synergy between Malaysia\'s vibrant "Truly Asia" identity and Nepal\'s rich cinematic heritage.</p><p>Discussions explored potential co-production opportunities between Nepali and Malaysian film industries, with both sides expressing strong interest in cultural exchange through cinema. The meeting marks a significant step in Kingdom Network\'s mission to bridge Nepali storytelling with international markets.</p><p>Producer Subash Bhusal presented the company\'s filmography including Pujar Sarki, the upcoming Fracture, and Shirjara: Song of Grandmother, highlighting Kingdom Network\'s commitment to globally relevant narratives rooted in Nepali culture.</p>',
                'excerpt' => 'Kingdom Network meets Malaysian Ambassador to discuss film co-production and cultural exchange.',
                'category_id' => $category->id,
                'status' => 'published',
                'published_at' => Carbon::now()->subDays(10),
                'featured' => false,
            ]
        );
    }
}
