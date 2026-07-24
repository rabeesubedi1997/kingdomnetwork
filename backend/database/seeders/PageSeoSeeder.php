<?php

namespace Database\Seeders;

use App\Models\PageSeo;
use Illuminate\Database\Seeder;

class PageSeoSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            ['route' => '/', 'title' => 'Home', 'description' => 'Kingdom Network is a leading film and media production company in Nepal.', 'schema_type' => 'WebPage'],
            ['route' => '/about', 'title' => 'About Us', 'description' => 'Learn about Kingdom Network\'s mission, team, and journey in Nepali cinema.', 'schema_type' => 'AboutPage'],
            ['route' => '/films', 'title' => 'Films', 'description' => 'Explore our complete filmography and upcoming productions.', 'schema_type' => 'CollectionPage'],
            ['route' => '/news', 'title' => 'News', 'description' => 'Latest news, announcements, and behind-the-scenes stories from Kingdom Network.', 'schema_type' => 'Blog'],
            ['route' => '/contact', 'title' => 'Contact', 'description' => 'Get in touch with Kingdom Network.', 'schema_type' => 'ContactPage'],
            ['route' => '/careers', 'title' => 'Careers', 'description' => 'Join our team and be part of Nepal\'s leading film production company.', 'schema_type' => 'WebPage'],
            ['route' => '/gallery', 'title' => 'Gallery', 'description' => 'Behind-the-scenes moments, production stills, and exclusive content.', 'schema_type' => 'CollectionPage'],
            ['route' => '/press', 'title' => 'Press', 'description' => 'Press kits and media resources for journalists.', 'schema_type' => 'WebPage'],
            ['route' => '/awards', 'title' => 'Awards', 'description' => 'Awards and accolades received by Kingdom Network.', 'schema_type' => 'CollectionPage'],
            ['route' => '/people', 'title' => 'People', 'description' => 'Cast and crew of Kingdom Network productions.', 'schema_type' => 'CollectionPage'],
            ['route' => '/team', 'title' => 'Team', 'description' => 'Meet the Kingdom Network team.', 'schema_type' => 'WebPage'],
            ['route' => '/privacy', 'title' => 'Privacy Policy', 'description' => 'Privacy policy for Kingdom Network.', 'schema_type' => 'WebPage'],
            ['route' => '/terms', 'title' => 'Terms of Service', 'description' => 'Terms and conditions for using Kingdom Network.', 'schema_type' => 'WebPage'],
        ];

        foreach ($defaults as $entry) {
            PageSeo::updateOrCreate(['route' => $entry['route']], $entry);
        }
    }
}
