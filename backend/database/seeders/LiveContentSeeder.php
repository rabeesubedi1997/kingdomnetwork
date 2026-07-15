<?php

namespace Database\Seeders;

use App\Models\Film;
use App\Models\TeamMember;
use App\Models\Banner;
use App\Models\Advertisement;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class LiveContentSeeder extends Seeder
{
    public function run(): void
    {
        Film::updateOrCreate(['slug' => 'pujar-sarki'], [
            'title' => 'Pujar Sarki',
            'slug' => 'pujar-sarki',
            'status' => 'released',
            'release_date' => '2024-05-23',
            'tagline' => 'One of the highest-grossing Nepali films of the year',
            'synopsis' => 'A raw and powerful portrayal of deep-rooted social cults that still exist in parts of Nepal. Told with such accuracy, it resonated with audiences — sparking awareness and responsibility for change while being widely loved.',
            'language' => 'Nepali',
            'country' => 'Nepal',
            'is_featured' => true,
            'rating' => 'PG',
        ]);

        Film::updateOrCreate(['slug' => 'fracture'], [
            'title' => 'Fracture',
            'slug' => 'fracture',
            'status' => 'released',
            'release_date' => '2025-06-15',
            'tagline' => 'A dramatic shift from social drama to adventurous action',
            'synopsis' => 'Directed by Emmy-winning filmmaker Ryan Travis, Fracture represents our passion for international collaboration, showcasing Nepalese culture to global audiences. It is where local stories meet the international platform.',
            'language' => 'Nepali',
            'country' => 'Nepal',
            'is_featured' => true,
            'rating' => 'PG-13',
        ]);

        Film::updateOrCreate(['slug' => 'song-of-my-grandmother'], [
            'title' => 'Song of My Grandmother',
            'slug' => 'song-of-my-grandmother',
            'status' => 'post_production',
            'release_date' => '2026-09-01',
            'tagline' => 'A story that deeply connects with everyday lives',
            'synopsis' => 'Our upcoming project explores stories that deeply connect with the everyday lives of Nepali people. With the latest filmmaking technology and actors whose real-life experiences mirror their roles, this film aims to deliver authentic, relatable, and groundbreaking cinema.',
            'language' => 'Nepali',
            'country' => 'Nepal',
            'is_featured' => false,
            'rating' => 'PG',
        ]);

        Film::create([
            'title' => 'A Millionaire (6 Crore)',
            'slug' => 'a-millionaire-6-crore',
            'status' => 'pre_production',
            'release_date' => '2026-12-15',
            'tagline' => 'From rags to riches',
            'synopsis' => 'An inspiring story of determination and ambition, exploring what it truly means to be a millionaire in today\'s Nepal.',
            'language' => 'Nepali',
            'country' => 'Nepal',
            'is_featured' => false,
            'rating' => 'PG',
        ]);

        Film::create([
            'title' => 'Nau Lakh Tara',
            'slug' => 'nau-lakh-tara',
            'status' => 'development',
            'release_date' => '2027-03-01',
            'tagline' => 'A future project in development',
            'synopsis' => 'An upcoming project that promises to push creative boundaries and set new standards in Nepali entertainment.',
            'language' => 'Nepali',
            'country' => 'Nepal',
            'is_featured' => false,
            'rating' => 'PG',
        ]);

        TeamMember::create([
            'name' => 'Subash Bhusal',
            'role' => 'Founder',
            'bio' => 'Subash Bhusal is a distinguished producer and musician in the Nepali entertainment industry. He is best known for producing the acclaimed 2024 film Pujar Sarki, a poignant social drama addressing caste-based discrimination in Nepal.',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        TeamMember::create([
            'name' => 'Bikash Subedi',
            'role' => 'Director',
            'bio' => 'Bikash Subedi is an accomplished scriptwriter, film director, and music video director in the Nepali entertainment industry. Celebrated for his versatility and creative vision.',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        Banner::updateOrCreate(['title' => 'Pujar Sarki'], [
            'title' => 'Pujar Sarki',
            'subtitle' => 'One of the highest-grossing Nepali films of the year',
            'link_url' => '/films/pujar-sarki',
            'link_text' => 'Learn More',
            'bg_color' => '#0d1a24',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Banner::updateOrCreate(['title' => 'Fracture'], [
            'title' => 'Fracture',
            'subtitle' => 'A dramatic shift from social drama to adventurous action',
            'link_url' => '/films/fracture',
            'link_text' => 'Learn More',
            'bg_color' => '#1a0d0d',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        Banner::updateOrCreate(['title' => 'Kingdom Network'], [
            'title' => 'Kingdom Network',
            'subtitle' => 'Redefining Nepali cinema through global collaboration',
            'link_url' => '/about',
            'link_text' => 'About Us',
            'bg_color' => '#09333f',
            'sort_order' => 3,
            'is_active' => true,
        ]);

        Advertisement::create([
            'title' => 'Pujar Sarki - Now Streaming',
            'type' => 'image',
            'position' => 'banner_top',
            'link_url' => '/films/pujar-sarki',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Advertisement::create([
            'title' => 'Join Our Team',
            'type' => 'image',
            'position' => 'sidebar',
            'link_url' => '/careers',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $menu = Menu::firstOrCreate(
            ['location' => 'header'],
            ['name' => 'Main Menu', 'is_active' => true]
        );

        $headerItems = [
            ['label' => 'Home', 'url' => '/', 'sort_order' => 1],
            ['label' => 'Projects', 'url' => '/films', 'sort_order' => 2],
            ['label' => 'About Us', 'url' => '/about', 'sort_order' => 3],
            ['label' => 'Contact', 'url' => '/contact', 'sort_order' => 4],
            ['label' => 'Careers', 'url' => '/careers', 'sort_order' => 5],
        ];

        foreach ($headerItems as $item) {
            MenuItem::updateOrCreate(
                ['menu_id' => $menu->id, 'label' => $item['label']],
                array_merge($item, ['menu_id' => $menu->id, 'is_active' => true])
            );
        }

        $settings = [
            'site_name' => 'Kingdom Network',
            'site_tagline' => 'Redefining Nepali cinema through global collaboration',
            'site_description' => 'Kingdom Network is a film production company redefining Nepali cinema by combining authentic local storytelling with global filmmaking collaborations.',
            'contact_address' => 'Kathmandu, Nepal',
            'contact_phone' => '+977-1-1234567',
            'contact_email' => 'info@kingdomnetwork.com.np',
            'social_facebook' => 'https://facebook.com/kingdomnetwork',
            'social_instagram' => 'https://instagram.com/kingdomnetwork',
            'social_youtube' => 'https://youtube.com/@kingdomnetwork',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
    }
}
