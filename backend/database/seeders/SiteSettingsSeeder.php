<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteSetting;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General
            ['key' => 'site_name', 'value' => 'Kingdom Network', 'group' => 'general', 'is_public' => true],
            ['key' => 'site_tagline', 'value' => 'Redefining Nepali Cinema', 'group' => 'general', 'is_public' => true],
            ['key' => 'site_description', 'value' => 'Kingdom Network is a leading film production company in Nepal, creating world-class movies that blend authentic local storytelling with global filmmaking collaborations.', 'group' => 'general', 'is_public' => true],
            
            // Contact
            ['key' => 'contact_address', 'value' => 'Kathmandu, Nepal', 'group' => 'contact', 'is_public' => true],
            ['key' => 'contact_phone', 'value' => '+977-1-1234567', 'group' => 'contact', 'is_public' => true],
            ['key' => 'contact_email', 'value' => 'info@kingdomnetwork.com.np', 'group' => 'contact', 'is_public' => true],
            
            // Social
            ['key' => 'social_facebook', 'value' => 'https://www.facebook.com/Kingdomntwork', 'group' => 'social', 'is_public' => true],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/kingdomnetwork', 'group' => 'social', 'is_public' => true],
            ['key' => 'social_twitter', 'value' => 'https://twitter.com/kingdomnetwork', 'group' => 'social', 'is_public' => true],
            ['key' => 'social_youtube', 'value' => 'https://youtube.com/@kingdomnetwork', 'group' => 'social', 'is_public' => true],
            ['key' => 'social_linkedin', 'value' => 'https://linkedin.com/company/kingdomnetwork', 'group' => 'social', 'is_public' => true],
            
            // SEO
            ['key' => 'seo_default_title', 'value' => 'Kingdom Network - Redefining Nepali Cinema', 'group' => 'seo', 'is_public' => false],
            ['key' => 'seo_title_template', 'value' => '%s | Kingdom Network', 'group' => 'seo', 'is_public' => false],
            ['key' => 'seo_default_description', 'value' => 'Kingdom Network is a leading film production company in Nepal, creating world-class movies that blend authentic local storytelling with global filmmaking collaborations.', 'group' => 'seo', 'is_public' => false],
            ['key' => 'seo_twitter_handle', 'value' => '@kingdomnetwork', 'group' => 'seo', 'is_public' => false],
            
            // Analytics
            ['key' => 'analytics_ga4_id', 'value' => '', 'group' => 'analytics', 'is_public' => false],
            ['key' => 'analytics_gtm_id', 'value' => '', 'group' => 'analytics', 'is_public' => false],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}