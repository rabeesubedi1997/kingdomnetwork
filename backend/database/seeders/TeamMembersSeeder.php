<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TeamMember;

class TeamMembersSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'name' => 'Subash Bhusal',
                'role' => 'Founder & Producer',
                'bio' => 'Distinguished producer and musician in the Nepali entertainment industry. Best known for producing the acclaimed 2024 film Pujar Sarki, a poignant social drama addressing caste-based discrimination in Nepal. Under the banner of Kingdom Network, Bhusal\'s production garnered widespread attention for its compelling storytelling and stellar performances.',
                'social_links' => [
                    'linkedin' => 'https://linkedin.com/in/subashbhusal',
                    'twitter' => 'https://twitter.com/subashbhusal',
                    'instagram' => 'https://instagram.com/subashbhusal',
                ],
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Bikash Subedi',
                'role' => 'Director',
                'bio' => 'Accomplished scriptwriter, film director, and music video director in the Nepali entertainment industry. Celebrated for his versatility and creative vision, he has made substantial contributions to the growth and evolution of Nepali cinema and music videos.',
                'social_links' => [
                    'linkedin' => 'https://linkedin.com/in/bikashsubedi',
                    'twitter' => 'https://twitter.com/bikashsubedi',
                    'instagram' => 'https://instagram.com/bikashsubedi',
                ],
                'sort_order' => 2,
                'is_active' => true,
            ],
        ];

        foreach ($members as $member) {
            TeamMember::updateOrCreate(
                ['name' => $member['name']],
                $member
            );
        }
    }
}