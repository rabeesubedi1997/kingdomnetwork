<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\AlbumImage;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Film;
use App\Models\FilmAward;
use App\Models\FilmCast;
use App\Models\FilmCrew;
use App\Models\Genre;
use App\Models\Job;
use App\Models\Media;
use App\Models\Partner;
use App\Models\Person;
use App\Models\Post;
use App\Models\PressKit;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Spatie\MediaLibrary\HasMedia;
use Throwable;

/**
 * Additive, idempotent demo content seeder.
 *
 * Generously populates Films, People, Team Members, News, Gallery Albums,
 * Banners, Partners, Testimonials, Press Kits and Jobs with realistic data
 * and working images (picsum.photos / placehold.co). Safe to re-run: every
 * insert is guarded by a firstOrCreate()/existence check keyed on a natural
 * unique field (slug/name/pivot), so nothing is duplicated.
 */
class RichDemoContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->command?->info('RichDemoContentSeeder: starting...');

        $people = $this->seedPeople();
        $genres = Genre::all()->keyBy('slug');

        $films = $this->seedFilms($people, $genres);

        $this->seedCastCrew($films, $people);
        $this->seedAwards($films);
        $this->seedTeamMembers();

        $categories = $this->seedCategories();
        $this->seedPosts($categories, $films);

        $this->seedGallery($films);
        $this->seedBanners($films);
        $this->seedPartners();
        $this->seedTestimonials();
        $this->seedPressKits($films);
        $this->seedJobs();

        $this->command?->info('RichDemoContentSeeder: complete.');
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private function img(string $seed, int $w, int $h): string
    {
        return "https://picsum.photos/seed/{$seed}/{$w}/{$h}";
    }

    private function logo(string $text): string
    {
        $encoded = str_replace(' ', '+', $text);

        return "https://placehold.co/240x100/09333f/ffcd57?text={$encoded}";
    }

    /**
     * Attach an image to a media-collection-backed model, downloading it
     * from a URL, unless that collection already has media (idempotent).
     */
    private function attachImage(HasMedia $model, string $collection, string $url, string $fileName): void
    {
        if ($model->getFirstMedia($collection)) {
            return;
        }

        try {
            $model->addMediaFromUrl($url)
                ->usingFileName($fileName)
                ->toMediaCollection($collection);
        } catch (Throwable $e) {
            Log::warning("RichDemoContentSeeder: failed to attach [{$collection}] media from {$url}: ".$e->getMessage());
        }
    }

    /**
     * Create (or reuse) a standalone Media row for models like TeamMember
     * whose "photo" is a plain FK to the media table rather than a
     * HasMedia collection. We physically attach the file to the first
     * Film record (any HasMedia owner works) under an ad-hoc collection.
     */
    private function standaloneMedia(string $seed, string $fileName): ?int
    {
        $carrier = Film::query()->orderBy('id')->first();

        if (! $carrier) {
            return null;
        }

        try {
            $media = $carrier->addMediaFromUrl($this->img($seed, 500, 500))
                ->usingFileName($fileName)
                ->toMediaCollection('team-temp');

            return $media->id;
        } catch (Throwable $e) {
            Log::warning("RichDemoContentSeeder: failed to create standalone media for {$seed}: ".$e->getMessage());

            return null;
        }
    }

    private function attachGenres(Film $film, array $slugs, Collection $genres): void
    {
        foreach ($slugs as $slug) {
            $genre = $genres->get($slug);
            if ($genre && ! $film->genres()->where('genre_id', $genre->id)->exists()) {
                $film->genres()->attach($genre->id);
            }
        }
    }

    // ------------------------------------------------------------------
    // People
    // ------------------------------------------------------------------

    private function seedPeople(): Collection
    {
        $newPeople = [
            ['slug' => 'maya-gurung', 'name' => 'Maya Gurung', 'role' => 'Actress', 'bio' => 'A versatile actress known for her emotionally layered performances in Nepali social dramas.'],
            ['slug' => 'sarita-lama', 'name' => 'Sarita Lama', 'role' => 'Actress', 'bio' => 'Rising star recognized for bold roles in thriller and action features.'],
            ['slug' => 'nabin-chettri', 'name' => 'Nabin Chettri', 'role' => 'Actor', 'bio' => 'Award-nominated actor with a decade of experience across drama and adventure films.'],
            ['slug' => 'reecha-sharma', 'name' => 'Reecha Sharma', 'role' => 'Actress', 'bio' => 'Celebrated leading actress known for critically acclaimed cross-border collaborations.'],
            ['slug' => 'saugat-malla', 'name' => 'Saugat Malla', 'role' => 'Actor', 'bio' => 'One of Nepali cinema\'s most respected character actors, praised for intensity and range.'],
            ['slug' => 'rajesh-payal-rai', 'name' => 'Rajesh Payal Rai', 'role' => 'Music Composer', 'bio' => 'Composer blending traditional Nepali folk instrumentation with contemporary film scoring.'],
            ['slug' => 'deepak-rauniyar-director', 'name' => 'Deepak Rauniyar', 'role' => 'Director', 'bio' => 'Director known for internationally co-produced films exploring identity and homecoming.'],
            ['slug' => 'sunir-pandey', 'name' => 'Sunir Pandey', 'role' => 'Cinematographer', 'bio' => 'Cinematographer celebrated for sweeping Himalayan landscape photography.'],
            ['slug' => 'kabita-adhikari', 'name' => 'Kabita Adhikari', 'role' => 'Film Editor', 'bio' => 'Editor with a sharp instinct for pacing in both drama and thriller narratives.'],
            ['slug' => 'rabindra-singh-baniya', 'name' => 'Rabindra Singh Baniya', 'role' => 'Actor & Writer', 'bio' => 'Actor-writer known for genre-bending action and thriller screenplays.'],
            ['slug' => 'menuka-pradhan', 'name' => 'Menuka Pradhan', 'role' => 'Actress', 'bio' => 'Actress admired for grounded performances in adventure and family dramas.'],
            ['slug' => 'prakash-ghimire', 'name' => 'Prakash Ghimire', 'role' => 'Producer & Writer', 'bio' => 'Producer-writer with a focus on socially resonant, festival-friendly storytelling.'],
        ];

        $map = [];
        foreach ($newPeople as $data) {
            $data['is_active'] = true;
            $person = Person::firstOrCreate(['slug' => $data['slug']], $data);
            $this->attachImage($person, 'photo', $this->img("kn-person-{$data['slug']}", 500, 500), "{$data['slug']}.jpg");
            $map[$data['slug']] = $person;
        }

        // Also make sure every already-existing person has a photo.
        foreach (Person::all() as $person) {
            $this->attachImage($person, 'photo', $this->img("kn-person-{$person->slug}", 500, 500), "{$person->slug}.jpg");
        }

        $this->command?->info('People seeded: '.Person::count());

        return Person::all()->keyBy('slug');
    }

    // ------------------------------------------------------------------
    // Films
    // ------------------------------------------------------------------

    private function seedFilms(Collection $people, Collection $genres): Collection
    {
        $pid = fn (?string $slug) => $slug && $people->has($slug) ? $people->get($slug)->id : null;

        $definitions = [
            [
                'data' => [
                    'slug' => 'machhapuchhre',
                    'title' => 'Machhapuchhre',
                    'tagline' => 'The mountain remembers what men forget.',
                    'synopsis' => 'A retired Gurkha soldier returns to his ancestral village beneath the fishtail peak of Machhapuchhre to confront a family feud left unresolved for a generation, only to find the mountain itself guarding secrets older than the war he fought in.',
                    'short_description' => 'A war-torn homecoming story set against the Annapurna range.',
                    'status' => 'released',
                    'release_date' => '2024-11-15',
                    'runtime_minutes' => 132,
                    'rating' => 'U/A',
                    'language' => 'Nepali',
                    'country' => 'Nepal',
                    'budget' => 45000000,
                    'box_office' => 112000000,
                    'trailer_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'director_id' => $pid('bikash-subedi'),
                    'producer_id' => $pid('subash-bhusal'),
                    'writer_id' => $pid('prakash-ghimire'),
                    'cinematographer_id' => $pid('rajesh-shrestha-cinematographer'),
                    'editor_id' => $pid('kabita-adhikari'),
                    'composer_id' => $pid('rajesh-payal-rai'),
                    'is_featured' => true,
                    'published_at' => '2024-11-01',
                ],
                'genres' => ['historical', 'drama'],
            ],
            [
                'data' => [
                    'slug' => 'the-last-monsoon',
                    'title' => 'The Last Monsoon',
                    'tagline' => 'Some storms wash away everything but the truth.',
                    'synopsis' => 'A Nepali-American documentary filmmaker returns to Kathmandu during monsoon season to reconnect with her estranged father, uncovering a family history entangled with the 2015 earthquake reconstruction.',
                    'short_description' => 'A cross-border family drama set during Nepal\'s monsoon season.',
                    'status' => 'released',
                    'release_date' => '2025-06-06',
                    'runtime_minutes' => 118,
                    'rating' => 'U',
                    'language' => 'Nepali, English',
                    'country' => 'Nepal, United States',
                    'budget' => 60000000,
                    'box_office' => 95000000,
                    'trailer_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'director_id' => $pid('deepak-rauniyar-director'),
                    'producer_id' => $pid('prakash-ghimire'),
                    'writer_id' => $pid('prakash-ghimire'),
                    'cinematographer_id' => $pid('sunir-pandey'),
                    'editor_id' => $pid('mahesh-tripathi'),
                    'composer_id' => $pid('rajesh-payal-rai'),
                    'is_featured' => true,
                    'published_at' => '2025-05-20',
                ],
                'genres' => ['drama', 'biography'],
            ],
            [
                'data' => [
                    'slug' => 'kalratri',
                    'title' => 'Kalratri',
                    'tagline' => 'Darkness has a memory.',
                    'synopsis' => 'A criminal psychologist is pulled back into the field to help solve a string of disappearances in Kathmandu, only to realize the killer\'s pattern mirrors a case she buried years ago.',
                    'short_description' => 'A psychological thriller set across Kathmandu\'s night streets.',
                    'status' => 'released',
                    'release_date' => '2025-10-31',
                    'runtime_minutes' => 104,
                    'rating' => 'A',
                    'language' => 'Nepali',
                    'country' => 'Nepal',
                    'budget' => 30000000,
                    'box_office' => 68000000,
                    'trailer_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'director_id' => $pid('bikash-subedi'),
                    'producer_id' => $pid('subash-bhusal'),
                    'writer_id' => $pid('rabindra-singh-baniya'),
                    'cinematographer_id' => $pid('sunir-pandey'),
                    'editor_id' => $pid('kabita-adhikari'),
                    'composer_id' => $pid('rajesh-payal-rai'),
                    'is_featured' => false,
                    'published_at' => '2025-10-15',
                ],
                'genres' => ['thriller', 'psychological-thriller'],
            ],
            [
                'data' => [
                    'slug' => 'sunkoshi',
                    'title' => 'Sunkoshi',
                    'tagline' => 'The river doesn\'t wait for the brave.',
                    'synopsis' => 'Three childhood friends attempt a first-ever rafting descent of the Sun Koshi river to raise money for their flood-hit village, testing loyalty and courage against the rapids.',
                    'short_description' => 'A high-stakes river adventure rooted in rural solidarity.',
                    'status' => 'released',
                    'release_date' => '2026-02-14',
                    'runtime_minutes' => 121,
                    'rating' => 'U/A',
                    'language' => 'Nepali',
                    'country' => 'Nepal',
                    'budget' => 38000000,
                    'box_office' => 81000000,
                    'trailer_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'director_id' => $pid('deepak-rauniyar-director'),
                    'producer_id' => $pid('subash-bhusal'),
                    'writer_id' => $pid('prakash-ghimire'),
                    'cinematographer_id' => $pid('rajesh-shrestha-cinematographer'),
                    'editor_id' => $pid('mahesh-tripathi'),
                    'composer_id' => $pid('rajesh-payal-rai'),
                    'is_featured' => false,
                    'published_at' => '2026-02-01',
                ],
                'genres' => ['adventure', 'drama'],
            ],
            [
                'data' => [
                    'slug' => 'rato-ashirwad',
                    'title' => 'Rato Ashirwad',
                    'tagline' => 'A blessing written in red.',
                    'synopsis' => 'A young widow fights to keep her late husband\'s tea garden alive against a land-grabbing syndicate, drawing the whole village into a quiet act of collective defiance.',
                    'short_description' => 'A social drama about land, legacy and quiet resistance.',
                    'status' => 'released',
                    'release_date' => '2026-05-01',
                    'runtime_minutes' => 110,
                    'rating' => 'U',
                    'language' => 'Nepali',
                    'country' => 'Nepal',
                    'budget' => 25000000,
                    'box_office' => 52000000,
                    'trailer_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'director_id' => $pid('prakash-ghimire'),
                    'producer_id' => $pid('subash-bhusal'),
                    'writer_id' => $pid('prakash-ghimire'),
                    'cinematographer_id' => $pid('sunir-pandey'),
                    'editor_id' => $pid('kabita-adhikari'),
                    'composer_id' => $pid('rajesh-payal-rai'),
                    'is_featured' => false,
                    'published_at' => '2026-04-20',
                ],
                'genres' => ['social-drama', 'drama'],
            ],
            [
                'data' => [
                    'slug' => 'bhulbhulaiya-kathmandu',
                    'title' => 'Bhulbhulaiya Kathmandu',
                    'tagline' => 'The city has more secrets than streets.',
                    'synopsis' => 'An undercover detective chases a smuggling ring through the labyrinthine alleys of old Kathmandu, only to discover the trail leads straight back to his own precinct.',
                    'short_description' => 'A high-octane action-thriller through the streets of Kathmandu.',
                    'status' => 'released',
                    'release_date' => '2026-07-10',
                    'runtime_minutes' => 128,
                    'rating' => 'A',
                    'language' => 'Nepali',
                    'country' => 'Nepal',
                    'budget' => 55000000,
                    'box_office' => 130000000,
                    'trailer_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'director_id' => $pid('rabindra-singh-baniya'),
                    'producer_id' => $pid('prakash-ghimire'),
                    'writer_id' => $pid('rabindra-singh-baniya'),
                    'cinematographer_id' => $pid('rajesh-shrestha-cinematographer'),
                    'editor_id' => $pid('mahesh-tripathi'),
                    'composer_id' => $pid('rajesh-payal-rai'),
                    'is_featured' => true,
                    'published_at' => '2026-06-25',
                ],
                'genres' => ['action', 'thriller'],
            ],
            [
                'data' => [
                    'slug' => 'highway-to-mustang',
                    'title' => 'Highway to Mustang',
                    'tagline' => 'Beyond the last road.',
                    'synopsis' => 'A documentary-style road film following four riders crossing the newly built highway into Upper Mustang, capturing a vanishing way of life as modernity paves its way through the Himalayas.',
                    'short_description' => 'A road-trip documentary drama into the trans-Himalayan plateau.',
                    'status' => 'pre_production',
                    'release_date' => '2027-10-01',
                    'runtime_minutes' => null,
                    'rating' => null,
                    'language' => 'Nepali',
                    'country' => 'Nepal',
                    'budget' => 42000000,
                    'box_office' => null,
                    'trailer_url' => null,
                    'director_id' => $pid('deepak-rauniyar-director'),
                    'producer_id' => $pid('subash-bhusal'),
                    'writer_id' => $pid('prakash-ghimire'),
                    'cinematographer_id' => $pid('sunir-pandey'),
                    'editor_id' => null,
                    'composer_id' => null,
                    'is_featured' => false,
                    'published_at' => '2026-08-15',
                ],
                'genres' => ['adventure', 'documentary'],
            ],
            [
                'data' => [
                    'slug' => 'chiya-bagan',
                    'title' => 'Chiya Bagan',
                    'tagline' => 'Every leaf holds a story.',
                    'synopsis' => 'Set across three generations of women working the same eastern Nepal tea estate, this upcoming feature traces how the garden shapes -- and is shaped by -- the families who tend it.',
                    'short_description' => 'A multi-generational social drama set on a tea estate.',
                    'status' => 'announced',
                    'release_date' => '2028-03-01',
                    'runtime_minutes' => null,
                    'rating' => null,
                    'language' => 'Nepali',
                    'country' => 'Nepal',
                    'budget' => null,
                    'box_office' => null,
                    'trailer_url' => null,
                    'director_id' => $pid('bikash-subedi'),
                    'producer_id' => $pid('subash-bhusal'),
                    'writer_id' => $pid('rabindra-singh-baniya'),
                    'cinematographer_id' => null,
                    'editor_id' => null,
                    'composer_id' => null,
                    'is_featured' => false,
                    'published_at' => '2026-08-28',
                ],
                'genres' => ['social-drama'],
            ],
            [
                'data' => [
                    'slug' => 'silent-peaks',
                    'title' => 'Silent Peaks',
                    'tagline' => 'Some stories the mountains keep.',
                    'synopsis' => 'A planned documentary following a Himalayan search-and-rescue team was shelved after key funding partners withdrew during pre-production financing talks.',
                    'short_description' => 'A shelved documentary on Himalayan search-and-rescue teams.',
                    'status' => 'cancelled',
                    'release_date' => null,
                    'runtime_minutes' => null,
                    'rating' => null,
                    'language' => 'Nepali',
                    'country' => 'Nepal',
                    'budget' => 18000000,
                    'box_office' => null,
                    'trailer_url' => null,
                    'director_id' => $pid('deepak-rauniyar-director'),
                    'producer_id' => $pid('prakash-ghimire'),
                    'writer_id' => null,
                    'cinematographer_id' => $pid('rajesh-shrestha-cinematographer'),
                    'editor_id' => null,
                    'composer_id' => null,
                    'is_featured' => false,
                    'published_at' => null,
                ],
                'genres' => ['documentary'],
            ],
        ];

        foreach ($definitions as $def) {
            $film = Film::firstOrCreate(['slug' => $def['data']['slug']], $def['data']);
            $this->attachImage($film, 'poster', $this->img("kn-film-{$film->slug}-poster", 800, 1200), "{$film->slug}-poster.jpg");
            $this->attachImage($film, 'banner', $this->img("kn-film-{$film->slug}-banner", 1920, 1080), "{$film->slug}-banner.jpg");
            $this->attachGenres($film, $def['genres'], $genres);
        }

        // Make sure pre-existing films also have images.
        foreach (Film::all() as $film) {
            $this->attachImage($film, 'poster', $this->img("kn-film-{$film->slug}-poster", 800, 1200), "{$film->slug}-poster.jpg");
            $this->attachImage($film, 'banner', $this->img("kn-film-{$film->slug}-banner", 1920, 1080), "{$film->slug}-banner.jpg");
        }

        $this->command?->info('Films seeded: '.Film::count());

        return Film::all()->keyBy('slug');
    }

    // ------------------------------------------------------------------
    // Cast & Crew
    // ------------------------------------------------------------------

    private function addCast(Film $film, Collection $people, string $slug, string $roleName, bool $isLead, int $sort): void
    {
        $person = $people->get($slug);
        if (! $person) {
            return;
        }

        FilmCast::firstOrCreate(
            ['film_id' => $film->id, 'person_id' => $person->id],
            ['role_name' => $roleName, 'is_lead' => $isLead, 'sort_order' => $sort]
        );
    }

    private function addCrew(Film $film, Collection $people, string $slug, string $department, string $role, int $sort): void
    {
        $person = $people->get($slug);
        if (! $person) {
            return;
        }

        FilmCrew::firstOrCreate(
            ['film_id' => $film->id, 'person_id' => $person->id],
            ['department' => $department, 'role' => $role, 'sort_order' => $sort]
        );
    }

    private function seedCastCrew(Collection $films, Collection $people): void
    {
        $plan = [
            'pujar-sarki' => [
                'cast' => [['aryan-sigdel', 'Lead Role', true], ['pradeep-khadka', 'Lead Role', true], ['paul-shah', 'Supporting Role', false]],
                'crew' => [['dinesh-raut', 'Direction', 'Director'], ['rajesh-shrestha-cinematographer', 'Camera', 'Cinematographer'], ['kabita-adhikari', 'Post-Production', 'Editor']],
            ],
            'fracture' => [
                'cast' => [['luanabajrami', 'Lead Role', true], ['chris-beyrooty', 'Lead Role', true], ['bharat-regmi', 'Supporting Role', false]],
                'crew' => [['ryan-travis', 'Direction', 'Director'], ['michele-coggiola', 'Camera', 'Cinematographer'], ['mahesh-tripathi', 'Post-Production', 'Editor']],
            ],
            'shirjara-song-of-grandmother' => [
                'cast' => [['swastima-khadka', 'Lead Role', true], ['anup-bikram-shahi', 'Lead Role', true], ['anita-pandit', 'Supporting Role', false]],
                'crew' => [['bikash-subedi', 'Direction', 'Director'], ['rajesh-shrestha-cinematographer', 'Camera', 'Cinematographer'], ['mahesh-tripathi', 'Post-Production', 'Editor']],
            ],
            'machhapuchhre' => [
                'cast' => [['swastima-khadka', 'Lead Role', true], ['pradeep-khadka', 'Lead Role', true], ['menuka-pradhan', 'Supporting Role', false]],
                'crew' => [['bikash-subedi', 'Direction', 'Director'], ['rajesh-shrestha-cinematographer', 'Camera', 'Cinematographer'], ['kabita-adhikari', 'Post-Production', 'Editor']],
            ],
            'the-last-monsoon' => [
                'cast' => [['reecha-sharma', 'Lead Role', true], ['saugat-malla', 'Lead Role', true], ['anita-pandit', 'Supporting Role', false]],
                'crew' => [['deepak-rauniyar-director', 'Direction', 'Director'], ['sunir-pandey', 'Camera', 'Cinematographer'], ['mahesh-tripathi', 'Post-Production', 'Editor']],
            ],
            'kalratri' => [
                'cast' => [['nabin-chettri', 'Lead Role', true], ['sarita-lama', 'Lead Role', true], ['buddhi-tamang', 'Supporting Role', false]],
                'crew' => [['bikash-subedi', 'Direction', 'Director'], ['sunir-pandey', 'Camera', 'Cinematographer'], ['kabita-adhikari', 'Post-Production', 'Editor']],
            ],
            'sunkoshi' => [
                'cast' => [['pradeep-khadka', 'Lead Role', true], ['menuka-pradhan', 'Lead Role', true], ['ashish-purush', 'Supporting Role', false]],
                'crew' => [['deepak-rauniyar-director', 'Direction', 'Director'], ['rajesh-shrestha-cinematographer', 'Camera', 'Cinematographer'], ['mahesh-tripathi', 'Post-Production', 'Editor']],
            ],
            'rato-ashirwad' => [
                'cast' => [['anita-pandit', 'Lead Role', true], ['nabin-chettri', 'Lead Role', true], ['swastima-khadka', 'Supporting Role', false]],
                'crew' => [['prakash-ghimire', 'Direction', 'Director'], ['sunir-pandey', 'Camera', 'Cinematographer'], ['kabita-adhikari', 'Post-Production', 'Editor']],
            ],
            'bhulbhulaiya-kathmandu' => [
                'cast' => [['saugat-malla', 'Lead Role', true], ['sarita-lama', 'Lead Role', true], ['aryan-sigdel', 'Supporting Role', false]],
                'crew' => [['rabindra-singh-baniya', 'Direction', 'Director'], ['rajesh-shrestha-cinematographer', 'Camera', 'Cinematographer'], ['mahesh-tripathi', 'Post-Production', 'Editor']],
            ],
            'highway-to-mustang' => [
                'cast' => [['menuka-pradhan', 'Lead Role', true], ['nabin-chettri', 'Supporting Role', false]],
                'crew' => [['deepak-rauniyar-director', 'Direction', 'Director'], ['sunir-pandey', 'Camera', 'Cinematographer']],
            ],
            'chiya-bagan' => [
                'cast' => [['swastima-khadka', 'Lead Role', true], ['sarita-lama', 'Supporting Role', false]],
                'crew' => [['bikash-subedi', 'Direction', 'Director'], ['subash-bhusal', 'Production', 'Producer']],
            ],
            'silent-peaks' => [
                'cast' => [['buddhi-tamang', 'Lead Role', true], ['ashish-purush', 'Supporting Role', false]],
                'crew' => [['deepak-rauniyar-director', 'Direction', 'Director'], ['rajesh-shrestha-cinematographer', 'Camera', 'Cinematographer']],
            ],
        ];

        foreach ($plan as $slug => $rows) {
            $film = $films->get($slug);
            if (! $film) {
                continue;
            }

            foreach ($rows['cast'] as $i => [$personSlug, $roleName, $isLead]) {
                $this->addCast($film, $people, $personSlug, $roleName, $isLead, $i);
            }

            foreach ($rows['crew'] as $i => [$personSlug, $department, $role]) {
                $this->addCrew($film, $people, $personSlug, $department, $role, $i);
            }
        }

        $this->command?->info('Film cast rows: '.FilmCast::count().', crew rows: '.FilmCrew::count());
    }

    // ------------------------------------------------------------------
    // Awards
    // ------------------------------------------------------------------

    private function seedAwards(Collection $films): void
    {
        $awards = [
            ['machhapuchhre', 'National Film Award 2082', 'Best Historical Film', 2025, 'won'],
            ['machhapuchhre', 'SAARC Film Festival 2025', 'Best Feature Film', 2025, 'nominated'],
            ['machhapuchhre', 'Everest Film Awards 2025', 'Best Actor', 2025, 'won'],
            ['the-last-monsoon', 'Golden Nepali Film Award 2025', 'Best Film', 2025, 'nominated'],
            ['the-last-monsoon', 'Nepal Film Critics Circle Awards 2026', 'Best Actress', 2026, 'won'],
            ['the-last-monsoon', 'SAARC Film Festival 2025', 'Best International Co-Production', 2025, 'won'],
            ['kalratri', 'Everest Film Awards 2025', 'Best Thriller', 2025, 'won'],
            ['kalratri', 'Nepal Motion Picture Academy Awards 2026', 'Best Sound Design', 2026, 'nominated'],
            ['sunkoshi', 'Kathmandu International Mountain Film Festival 2026', 'Best Cinematography', 2026, 'won'],
            ['sunkoshi', 'Nepal Film Critics Circle Awards 2026', 'Best Adventure Film', 2026, 'nominated'],
            ['rato-ashirwad', 'Golden Nepali Film Award 2026', 'Best Supporting Actress', 2026, 'nominated'],
            ['bhulbhulaiya-kathmandu', 'Nepal Motion Picture Academy Awards 2026', 'Best Action Choreography', 2026, 'won'],
            ['bhulbhulaiya-kathmandu', 'Everest Film Awards 2026', 'Best Editing', 2026, 'nominated'],
            ['fracture', 'SAARC Film Festival 2025', 'Best Work-in-Progress Co-Production', 2025, 'nominated'],
        ];

        foreach ($awards as [$slug, $awardName, $category, $year, $result]) {
            $film = $films->get($slug);
            if (! $film) {
                continue;
            }

            FilmAward::firstOrCreate(
                ['film_id' => $film->id, 'award_name' => $awardName, 'category' => $category],
                ['year' => $year, 'result' => $result, 'notes' => null]
            );
        }

        $this->command?->info('Film awards total: '.FilmAward::count());
    }

    // ------------------------------------------------------------------
    // Team Members
    // ------------------------------------------------------------------

    private function seedTeamMembers(): void
    {
        $members = [
            [
                'name' => 'Nirmala Adhikari',
                'role' => 'Co-Founder & Chief Creative Officer',
                'bio' => 'Nirmala oversees the creative direction and script development slate across every Kingdom Network production.',
                'email' => 'nirmala.adhikari@kingdomnetwork.com.np',
                'instagram_url' => 'https://instagram.com/nirmala.adhikari',
                'linkedin_url' => 'https://linkedin.com/in/nirmala-adhikari',
                'twitter_url' => 'https://twitter.com/nirmaladhikari',
            ],
            [
                'name' => 'Sandesh Malla',
                'role' => 'Head of Production',
                'bio' => 'Sandesh manages on-set logistics, scheduling and budgets for all active productions.',
                'email' => 'sandesh.malla@kingdomnetwork.com.np',
                'linkedin_url' => 'https://linkedin.com/in/sandesh-malla',
                'website_url' => 'https://sandeshmalla.example.com',
            ],
            [
                'name' => 'Kiran Bogati',
                'role' => 'Head of Marketing & Distribution',
                'bio' => 'Kiran leads theatrical and streaming distribution strategy for Kingdom Network releases.',
                'email' => 'kiran.bogati@kingdomnetwork.com.np',
                'instagram_url' => 'https://instagram.com/kiranbogati',
                'twitter_url' => 'https://twitter.com/kiranbogati',
                'linkedin_url' => 'https://linkedin.com/in/kiran-bogati',
            ],
            [
                'name' => 'Sabina Rai',
                'role' => 'Casting Director',
                'bio' => 'Sabina has cast lead and supporting roles across every Kingdom Network feature since 2023.',
                'email' => 'sabina.rai@kingdomnetwork.com.np',
                'instagram_url' => 'https://instagram.com/sabinarai.casting',
                'imdb_url' => 'https://www.imdb.com/name/nm0000001/',
            ],
            [
                'name' => 'Aakash Shrestha',
                'role' => 'Head of Post-Production',
                'bio' => 'Aakash runs the editing, sound design and VFX pipeline for all in-house releases.',
                'email' => 'aakash.shrestha@kingdomnetwork.com.np',
                'linkedin_url' => 'https://linkedin.com/in/aakash-shrestha',
                'website_url' => 'https://aakashshrestha.example.com',
            ],
            [
                'name' => 'Puja Lama',
                'role' => 'Head of Public Relations',
                'bio' => 'Puja manages press relations, festival submissions and premiere event coordination.',
                'email' => 'puja.lama@kingdomnetwork.com.np',
                'instagram_url' => 'https://instagram.com/pujalama.pr',
                'twitter_url' => 'https://twitter.com/pujalamapr',
                'linkedin_url' => 'https://linkedin.com/in/puja-lama',
            ],
        ];

        foreach ($members as $i => $data) {
            $data['sort_order'] = $i + 2; // existing 2 members occupy 0-1
            $data['is_active'] = true;
            $member = TeamMember::updateOrCreate(['name' => $data['name']], $data);

            if (empty($member->photo_id)) {
                $mediaId = $this->standaloneMedia(
                    'kn-team-'.\Illuminate\Support\Str::slug($data['name']),
                    \Illuminate\Support\Str::slug($data['name']).'.jpg'
                );
                if ($mediaId) {
                    $member->update(['photo_id' => $mediaId]);
                }
            }
        }

        // Ensure any pre-existing team members also have a photo.
        foreach (TeamMember::all() as $member) {
            if (empty($member->photo_id)) {
                $mediaId = $this->standaloneMedia(
                    'kn-team-'.\Illuminate\Support\Str::slug($member->name),
                    \Illuminate\Support\Str::slug($member->name).'.jpg'
                );
                if ($mediaId) {
                    $member->update(['photo_id' => $mediaId]);
                }
            }
        }

        $this->command?->info('Team members seeded: '.TeamMember::count());
    }

    // ------------------------------------------------------------------
    // News / Posts
    // ------------------------------------------------------------------

    private function seedCategories(): Collection
    {
        $categories = [
            ['slug' => 'film-updates', 'name' => 'Film Updates'],
            ['slug' => 'awards', 'name' => 'Awards'],
            ['slug' => 'festivals', 'name' => 'Festivals'],
            ['slug' => 'casting', 'name' => 'Casting'],
            ['slug' => 'premieres', 'name' => 'Premieres'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }

        return Category::all()->keyBy('slug');
    }

    private function seedPosts(Collection $categories, Collection $films): void
    {
        $posts = [
            [
                'slug' => 'kalratri-wraps-principal-photography',
                'title' => 'Kalratri Wraps Principal Photography in Kathmandu Valley',
                'excerpt' => 'The psychological thriller starring Nabin Chettri and Sarita Lama has completed its 45-day shoot across Kathmandu Valley locations.',
                'content' => "<p>Kingdom Network has officially wrapped principal photography on <strong>Kalratri</strong>, its upcoming psychological thriller starring Nabin Chettri and Sarita Lama.</p><p>Director Bikash Subedi praised the cast and crew for completing the demanding 45-day night shoot across multiple Kathmandu Valley locations. The film now moves into post-production, with an editing timeline targeting a late-2025 release.</p>",
                'category' => 'film-updates',
                'featured' => false,
                'published_at' => '2025-09-01',
                'img' => 'kn-news-kalratri-wrap',
            ],
            [
                'slug' => 'the-last-monsoon-saarc-official-selection',
                'title' => 'The Last Monsoon Selected for SAARC Film Festival Official Selection',
                'excerpt' => 'Kingdom Network\'s Nepal-US co-production earns an official selection slot at the 2025 SAARC Film Festival.',
                'content' => "<p><strong>The Last Monsoon</strong> has been named to the official selection of the 2025 SAARC Film Festival, marking Kingdom Network's first international festival selection for a co-produced feature.</p><p>The film, directed by Deepak Rauniyar, will screen in competition alongside entries from across South Asia.</p>",
                'category' => 'festivals',
                'featured' => true,
                'published_at' => '2025-10-15',
                'img' => 'kn-news-last-monsoon-saarc',
            ],
            [
                'slug' => 'casting-announced-bhulbhulaiya-kathmandu',
                'title' => 'Casting Announced: Saugat Malla and Sarita Lama to Lead Bhulbhulaiya Kathmandu',
                'excerpt' => 'The upcoming action-thriller has locked its lead cast ahead of a 2026 production start.',
                'content' => "<p>Kingdom Network has confirmed Saugat Malla and Sarita Lama in the lead roles of <strong>Bhulbhulaiya Kathmandu</strong>, an action-thriller set in the winding alleys of old Kathmandu.</p><p>Production is scheduled to begin in early 2026 under director Rabindra Singh Baniya.</p>",
                'category' => 'casting',
                'featured' => false,
                'published_at' => '2026-01-20',
                'img' => 'kn-news-bhulbhulaiya-casting',
            ],
            [
                'slug' => 'behind-the-scenes-sunkoshi-river-set',
                'title' => 'Behind the Scenes: Building the Sunkoshi River Set',
                'excerpt' => 'A look at how the production team recreated the Sun Koshi rapids for the film\'s central rafting sequence.',
                'content' => "<p>Recreating a first-descent rafting sequence safely required Kingdom Network's stunt and rigging teams to build a custom rapids set on a controlled stretch of river.</p><p>Cinematographer Sunir Pandey shares how the team balanced practical river photography with safety-rig assisted stunt work for <strong>Sunkoshi</strong>.</p>",
                'category' => 'film-updates',
                'featured' => false,
                'published_at' => '2026-02-01',
                'img' => 'kn-news-sunkoshi-bts',
            ],
            [
                'slug' => 'machhapuchhre-wins-everest-film-awards-2025',
                'title' => 'Machhapuchhre Wins Big at Everest Film Awards 2025',
                'excerpt' => 'The historical drama picks up Best Actor honors and two additional nominations.',
                'content' => "<p><strong>Machhapuchhre</strong> had a strong night at the Everest Film Awards 2025, taking home the Best Actor trophy along with nominations for Best Feature Film.</p><p>Director Bikash Subedi dedicated the win to the film's crew and the mountain communities who supported the shoot.</p>",
                'category' => 'awards',
                'featured' => true,
                'published_at' => '2025-12-05',
                'img' => 'kn-news-machhapuchhre-award',
            ],
            [
                'slug' => 'kingdom-network-announces-rato-ashirwad-premiere',
                'title' => 'Kingdom Network Announces Premiere Date for Rato Ashirwad',
                'excerpt' => 'The social drama will hold its red-carpet premiere in Kathmandu this spring.',
                'content' => "<p>Kingdom Network has set a premiere date for <strong>Rato Ashirwad</strong>, its upcoming social drama about land and legacy in eastern Nepal's tea gardens.</p><p>The red-carpet event will be held in Kathmandu, followed by a nationwide theatrical release.</p>",
                'category' => 'premieres',
                'featured' => false,
                'published_at' => '2026-04-10',
                'img' => 'kn-news-rato-ashirwad-premiere',
            ],
            [
                'slug' => 'highway-to-mustang-pre-production-cast',
                'title' => 'Highway to Mustang Enters Pre-Production with Fresh Ensemble Cast',
                'excerpt' => 'Menuka Pradhan and Nabin Chettri join the upcoming road documentary-drama set in Upper Mustang.',
                'content' => "<p>Kingdom Network has begun pre-production on <strong>Highway to Mustang</strong>, a road documentary-drama tracing a journey along the newly built highway into Upper Mustang.</p><p>Menuka Pradhan and Nabin Chettri lead an ensemble cast under director Deepak Rauniyar.</p>",
                'category' => 'casting',
                'featured' => false,
                'published_at' => '2026-06-18',
                'img' => 'kn-news-highway-mustang-preprod',
            ],
            [
                'slug' => 'kingdom-network-fifth-anniversary-slate',
                'title' => 'Kingdom Network Celebrates Fifth Anniversary with New Slate of Films',
                'excerpt' => 'The studio marks five years of Nepali storytelling with an ambitious upcoming production slate.',
                'content' => "<p>Kingdom Network is celebrating five years of redefining Nepali cinema with the announcement of an ambitious new production slate spanning drama, action and documentary features.</p><p>\"We started with one film and a lot of conviction,\" said Co-Founder Subash Bhusal. \"Five years later, we're proud to be building stories that travel far beyond Nepal.\"</p>",
                'category' => 'film-updates',
                'featured' => true,
                'published_at' => '2026-08-01',
                'img' => 'kn-news-fifth-anniversary',
            ],
        ];

        foreach ($posts as $data) {
            $category = $categories->get($data['category']);
            $post = Post::firstOrCreate(['slug' => $data['slug']], [
                'title' => $data['title'],
                'excerpt' => $data['excerpt'],
                'content' => $data['content'],
                'category_id' => $category?->id,
                'status' => 'published',
                'featured' => $data['featured'],
                'reading_time' => 3,
                'published_at' => $data['published_at'],
                'schema_type' => 'NewsArticle',
            ]);

            $this->attachImage($post, 'featured_image', $this->img($data['img'], 1200, 630), "{$data['slug']}.jpg");
        }

        // Ensure pre-existing posts also have featured images.
        foreach (Post::all() as $post) {
            $this->attachImage($post, 'featured_image', $this->img("kn-news-{$post->slug}", 1200, 630), "{$post->slug}.jpg");
        }

        $this->command?->info('Posts seeded: '.Post::count());
    }

    // ------------------------------------------------------------------
    // Gallery (Albums)
    // ------------------------------------------------------------------

    private function seedAlbumImages(Album $album, array $seeds, string $captionPrefix): void
    {
        if ($album->images()->count() > 0) {
            return; // already populated, avoid duplicating on re-run
        }

        foreach ($seeds as $i => $seed) {
            try {
                $media = $album->addMediaFromUrl($this->img($seed, 1000, 750))
                    ->usingFileName("{$seed}.jpg")
                    ->toMediaCollection('images');

                AlbumImage::create([
                    'album_id' => $album->id,
                    'media_id' => $media->id,
                    'caption' => "{$captionPrefix} ".($i + 1),
                    'sort_order' => $i,
                ]);
            } catch (Throwable $e) {
                Log::warning("RichDemoContentSeeder: failed to add album image {$seed}: ".$e->getMessage());
            }
        }
    }

    private function seedGallery(Collection $films): void
    {
        // Existing empty albums get images + covers.
        $existingBehindScenes = Album::where('slug', 'behind-the-scenes')->first();
        if ($existingBehindScenes) {
            $this->attachImage($existingBehindScenes, 'cover', $this->img('kn-album-behind-the-scenes-cover', 1000, 750), 'behind-the-scenes-cover.jpg');
            $this->seedAlbumImages($existingBehindScenes, [
                'kn-gallery-bts-1', 'kn-gallery-bts-2', 'kn-gallery-bts-3', 'kn-gallery-bts-4',
                'kn-gallery-bts-5', 'kn-gallery-bts-6', 'kn-gallery-bts-7', 'kn-gallery-bts-8',
            ], 'On set');
        }

        $existingFestival = Album::where('slug', 'festival-highlights')->first();
        if ($existingFestival) {
            $this->attachImage($existingFestival, 'cover', $this->img('kn-album-festival-highlights-cover', 1000, 750), 'festival-highlights-cover.jpg');
            $this->seedAlbumImages($existingFestival, [
                'kn-gallery-festival-1', 'kn-gallery-festival-2', 'kn-gallery-festival-3', 'kn-gallery-festival-4',
                'kn-gallery-festival-5', 'kn-gallery-festival-6', 'kn-gallery-festival-7', 'kn-gallery-festival-8',
            ], 'Festival moment');
        }

        $newAlbums = [
            [
                'slug' => 'premiere-night-pujar-sarki',
                'title' => 'Premiere Night — Pujar Sarki',
                'description' => 'Red-carpet moments from the Pujar Sarki Kathmandu premiere.',
                'category' => 'events',
                'film' => 'pujar-sarki',
                'images' => ['kn-gallery-premiere-pujar-1', 'kn-gallery-premiere-pujar-2', 'kn-gallery-premiere-pujar-3', 'kn-gallery-premiere-pujar-4', 'kn-gallery-premiere-pujar-5', 'kn-gallery-premiere-pujar-6', 'kn-gallery-premiere-pujar-7', 'kn-gallery-premiere-pujar-8'],
            ],
            [
                'slug' => 'production-stills-fracture',
                'title' => 'Production Stills — Fracture',
                'description' => 'On-location stills from the Fracture production.',
                'category' => 'stills',
                'film' => 'fracture',
                'images' => ['kn-gallery-fracture-still-1', 'kn-gallery-fracture-still-2', 'kn-gallery-fracture-still-3', 'kn-gallery-fracture-still-4', 'kn-gallery-fracture-still-5', 'kn-gallery-fracture-still-6', 'kn-gallery-fracture-still-7'],
            ],
            [
                'slug' => 'concept-art-shirjara',
                'title' => 'Concept Art — Shirjara: Song of Grandmother',
                'description' => 'Early visual development art for Shirjara: Song of Grandmother.',
                'category' => 'concept_art',
                'film' => 'shirjara-song-of-grandmother',
                'images' => ['kn-gallery-shirjara-concept-1', 'kn-gallery-shirjara-concept-2', 'kn-gallery-shirjara-concept-3', 'kn-gallery-shirjara-concept-4', 'kn-gallery-shirjara-concept-5', 'kn-gallery-shirjara-concept-6'],
            ],
            [
                'slug' => 'poster-art-collection',
                'title' => 'Poster Art Collection',
                'description' => 'Theatrical poster art across the Kingdom Network catalog.',
                'category' => 'posters',
                'film' => null,
                'images' => ['kn-gallery-poster-1', 'kn-gallery-poster-2', 'kn-gallery-poster-3', 'kn-gallery-poster-4', 'kn-gallery-poster-5', 'kn-gallery-poster-6', 'kn-gallery-poster-7', 'kn-gallery-poster-8'],
            ],
            [
                'slug' => 'marketing-campaign-machhapuchhre',
                'title' => 'Marketing Campaign — Machhapuchhre',
                'description' => 'Key art and campaign photography for the Machhapuchhre release.',
                'category' => 'marketing',
                'film' => 'machhapuchhre',
                'images' => ['kn-gallery-machhapuchhre-mktg-1', 'kn-gallery-machhapuchhre-mktg-2', 'kn-gallery-machhapuchhre-mktg-3', 'kn-gallery-machhapuchhre-mktg-4', 'kn-gallery-machhapuchhre-mktg-5', 'kn-gallery-machhapuchhre-mktg-6', 'kn-gallery-machhapuchhre-mktg-7'],
            ],
        ];

        foreach ($newAlbums as $data) {
            $filmId = $data['film'] ? $films->get($data['film'])?->id : null;

            $album = Album::firstOrCreate(['slug' => $data['slug']], [
                'title' => $data['title'],
                'description' => $data['description'],
                'category' => $data['category'],
                'film_id' => $filmId,
                'is_public' => true,
                'sort_order' => 0,
            ]);

            $this->attachImage($album, 'cover', $this->img("kn-album-{$data['slug']}-cover", 1000, 750), "{$data['slug']}-cover.jpg");
            $this->seedAlbumImages($album, $data['images'], $data['title']);
        }

        $this->command?->info('Albums seeded: '.Album::count().', album images: '.AlbumImage::count());
    }

    // ------------------------------------------------------------------
    // Banners
    // ------------------------------------------------------------------

    private function seedBanners(Collection $films): void
    {
        $banners = [
            [
                'title' => 'Pujar Sarki',
                'subtitle' => 'Now Streaming Everywhere',
                'link_url' => '/films/pujar-sarki',
                'link_text' => 'Watch Now',
                'img' => 'kn-banner-pujar-sarki',
            ],
            [
                'title' => 'The Last Monsoon',
                'subtitle' => 'In Cinemas Now',
                'link_url' => '/films/the-last-monsoon',
                'link_text' => 'Get Tickets',
                'img' => 'kn-banner-last-monsoon',
            ],
            [
                'title' => 'Bhulbhulaiya Kathmandu',
                'subtitle' => 'The City\'s Biggest Thriller',
                'link_url' => '/films/bhulbhulaiya-kathmandu',
                'link_text' => 'Watch Trailer',
                'img' => 'kn-banner-bhulbhulaiya',
            ],
            [
                'title' => 'Five Years of Kingdom Network',
                'subtitle' => 'Celebrating Five Years of Redefining Nepali Cinema',
                'link_url' => '/news/kingdom-network-fifth-anniversary-slate',
                'link_text' => 'Read More',
                'img' => 'kn-banner-fifth-anniversary',
            ],
            [
                'title' => 'Highway to Mustang',
                'subtitle' => 'Coming 2027 — Beyond the Last Road',
                'link_url' => '/films/highway-to-mustang',
                'link_text' => 'Learn More',
                'img' => 'kn-banner-highway-mustang',
            ],
        ];

        foreach ($banners as $i => $data) {
            Banner::firstOrCreate(['title' => $data['title']], [
                'subtitle' => $data['subtitle'],
                'link_url' => $data['link_url'],
                'link_text' => $data['link_text'],
                'image_url' => $this->img($data['img'], 1920, 1080),
                'sort_order' => $i,
                'is_active' => true,
            ]);
        }

        $this->command?->info('Banners seeded: '.Banner::count());
    }

    // ------------------------------------------------------------------
    // Partners
    // ------------------------------------------------------------------

    private function seedPartners(): void
    {
        $partners = [
            ['name' => 'Himalayan Frame Studios', 'category' => 'production', 'website_url' => 'https://himalayanframestudios.example.com'],
            ['name' => 'Sagarmatha Streamworks', 'category' => 'streaming', 'website_url' => 'https://sagarmathastream.example.com'],
            ['name' => 'Everest Film Guild', 'category' => 'guild', 'website_url' => 'https://everestfilmguild.example.com'],
            ['name' => 'Kathmandu International Film Festival', 'category' => 'festival', 'website_url' => 'https://kiff.example.com'],
            ['name' => 'Lumbini Cultural Foundation', 'category' => 'cultural', 'website_url' => 'https://lumbiniculturalfoundation.example.com'],
            ['name' => 'Trishuli Media Distribution', 'category' => 'distribution', 'website_url' => 'https://trishulimedia.example.com'],
            ['name' => 'Pashupati Post-Production House', 'category' => 'production', 'website_url' => 'https://pashupatipost.example.com'],
            ['name' => 'Annapurna Arts Council', 'category' => 'cultural', 'website_url' => 'https://annapurnaartscouncil.example.com'],
        ];

        foreach ($partners as $i => $data) {
            Partner::firstOrCreate(['name' => $data['name']], [
                'logo_url' => $this->logo($data['name']),
                'website_url' => $data['website_url'],
                'category' => $data['category'],
                'is_active' => true,
                'sort_order' => $i,
            ]);
        }

        $this->command?->info('Partners seeded: '.Partner::count());
    }

    // ------------------------------------------------------------------
    // Testimonials
    // ------------------------------------------------------------------

    private function seedTestimonials(): void
    {
        $testimonials = [
            ['name' => 'Anil Koirala', 'position' => 'Festival Programmer', 'company' => 'Kathmandu International Film Festival', 'content' => 'Kingdom Network consistently brings festival-quality craftsmanship to every submission. Pujar Sarki was one of the standout premieres of our program.', 'rating' => 5],
            ['name' => 'Sophia Marchetti', 'position' => 'Co-Producer', 'company' => 'European Partner Studio', 'content' => 'Working with the Kingdom Network team on Fracture was seamless from financing through post. Their production discipline matches any studio we\'ve partnered with globally.', 'rating' => 5],
            ['name' => 'Ram Bahadur Thapa', 'position' => 'Cinema Chain Owner', 'company' => 'Multiplex Nepal', 'content' => 'Every Kingdom Network release we\'ve booked has over-performed at the box office. Their marketing and audience targeting is best-in-class.', 'rating' => 4],
            ['name' => 'Kiran Manandhar', 'position' => 'Film Critic', 'company' => 'Nepal Film Critics Circle', 'content' => 'There\'s a clear creative vision running through Kingdom Network\'s catalog — ambitious storytelling without losing sight of Nepali audiences.', 'rating' => 5],
            ['name' => 'Laxmi Devkota', 'position' => 'Festival Director', 'company' => 'SAARC Film Festival', 'content' => 'The Last Monsoon was a highlight of our official selection. Kingdom Network is quickly becoming a name festival programmers watch closely.', 'rating' => 5],
            ['name' => 'James Whitfield', 'position' => 'International Distributor', 'company' => 'Whitfield Media Partners', 'content' => 'Kingdom Network delivers clean, festival-ready masters and are a pleasure to negotiate international rights with.', 'rating' => 4],
            ['name' => 'Nisha Karki', 'position' => 'Talent Agent', 'company' => 'Karki Artist Management', 'content' => 'My clients always come back from a Kingdom Network set speaking highly of how professionally the production is run.', 'rating' => 5],
        ];

        foreach ($testimonials as $i => $data) {
            Testimonial::firstOrCreate(['name' => $data['name'], 'company' => $data['company']], [
                'position' => $data['position'],
                'content' => $data['content'],
                'photo_url' => $this->img('kn-testimonial-'.\Illuminate\Support\Str::slug($data['name']), 500, 500),
                'rating' => $data['rating'],
                'is_active' => true,
                'sort_order' => $i,
            ]);
        }

        $this->command?->info('Testimonials seeded: '.Testimonial::count());
    }

    // ------------------------------------------------------------------
    // Press Kits
    // ------------------------------------------------------------------

    private function seedPressKits(Collection $films): void
    {
        $kits = [
            [
                'slug' => 'fracture-press-kit',
                'film' => 'fracture',
                'title' => 'Fracture — Press Kit',
                'logline' => 'A Nepal-US co-production thriller about a family fractured across two continents.',
            ],
            [
                'slug' => 'the-last-monsoon-press-kit',
                'film' => 'the-last-monsoon',
                'title' => 'The Last Monsoon — Press Kit',
                'logline' => 'A documentary filmmaker returns to Kathmandu during monsoon season to confront her family\'s past.',
            ],
        ];

        foreach ($kits as $data) {
            $film = $films->get($data['film']);
            if (! $film) {
                continue;
            }

            PressKit::firstOrCreate(['slug' => $data['slug']], [
                'film_id' => $film->id,
                'title' => $data['title'],
                'logline' => $data['logline'],
                'synopsis_short' => $film->short_description,
                'synopsis_long' => $film->synopsis,
                'key_cast' => FilmCast::where('film_id', $film->id)->with('person')->get()
                    ->map(fn ($c) => ['name' => $c->person?->name, 'role' => $c->role_name])->toArray(),
                'key_crew' => FilmCrew::where('film_id', $film->id)->with('person')->get()
                    ->map(fn ($c) => ['name' => $c->person?->name, 'role' => $c->role])->toArray(),
                'technical_specs' => [
                    'runtime' => $film->runtime_minutes ? "{$film->runtime_minutes} min" : 'TBD',
                    'language' => $film->language,
                    'country' => $film->country,
                    'aspect_ratio' => '2.39:1',
                ],
                'festival_history' => [],
                'awards' => FilmAward::where('film_id', $film->id)->get()
                    ->map(fn ($a) => ['name' => $a->award_name, 'result' => $a->result, 'year' => $a->year])->toArray(),
                'assets' => [
                    ['title' => 'Official Poster (High-Res)', 'type' => 'image', 'url' => $film->poster_url],
                    ['title' => 'Official Trailer', 'type' => 'video', 'url' => $film->trailer_url],
                    ['title' => 'Production Fact Sheet', 'type' => 'document', 'url' => $film->banner_url],
                ],
                'contact_email' => 'press@kingdomnetwork.com.np',
                'contact_phone' => '+977-1-4000000',
                'is_public' => true,
            ]);
        }

        $this->command?->info('Press kits seeded: '.PressKit::count());
    }

    // ------------------------------------------------------------------
    // Jobs
    // ------------------------------------------------------------------

    private function seedJobs(): void
    {
        $jobs = [
            ['title' => 'Assistant Director', 'department' => 'Production', 'type' => 'full_time', 'location' => 'Kathmandu, Nepal', 'is_remote' => false],
            ['title' => 'Sound Designer', 'department' => 'Post-Production', 'type' => 'contract', 'location' => 'Kathmandu, Nepal', 'is_remote' => false],
            ['title' => 'Costume Designer', 'department' => 'Art Department', 'type' => 'freelance', 'location' => 'Kathmandu, Nepal', 'is_remote' => false],
            ['title' => 'Social Media Manager', 'department' => 'Marketing', 'type' => 'part_time', 'location' => 'Kathmandu, Nepal', 'is_remote' => true],
            ['title' => 'Line Producer', 'department' => 'Production', 'type' => 'full_time', 'location' => 'Kathmandu, Nepal', 'is_remote' => false],
            ['title' => 'Screenwriting Intern', 'department' => 'Development', 'type' => 'internship', 'location' => 'Kathmandu, Nepal', 'is_remote' => true],
        ];

        foreach ($jobs as $data) {
            $slug = \Illuminate\Support\Str::slug($data['title']);

            Job::firstOrCreate(['slug' => $slug], [
                'title' => $data['title'],
                'department' => $data['department'],
                'type' => $data['type'],
                'location' => $data['location'],
                'description' => "We are looking for a talented {$data['title']} to join the {$data['department']} team at Kingdom Network, contributing to our growing slate of Nepali feature films.",
                'requirements' => "Prior experience in {$data['department']} on feature film or television productions preferred. Strong collaborative skills and availability for on-location work in Nepal.",
                'benefits' => 'Competitive compensation, on-set meals, and the opportunity to work on nationally released feature films.',
                'salary_range' => 'Negotiable, based on experience',
                'is_remote' => $data['is_remote'],
                'is_open' => true,
                'sort_order' => 0,
                'published_at' => now(),
            ]);
        }

        $this->command?->info('Jobs seeded: '.Job::count());
    }
}
