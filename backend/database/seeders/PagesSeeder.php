<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;

class PagesSeeder extends Seeder
{
    public function run(): void
    {
        Page::updateOrCreate(['slug' => 'privacy'], [
            'title' => 'Privacy Policy',
            'slug' => 'privacy',
            'content' => '<h1>Privacy Policy</h1><p>Last updated: ' . date('F j, Y') . '</p><h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you contact us through our website, subscribe to our newsletter, or apply for a job.</p><h2>How We Use Your Information</h2><p>We use the information we collect to respond to your inquiries, send you marketing communications (with your consent), process job applications, and improve our website.</p><h2>Cookies</h2><p>We use cookies to enhance your browsing experience and analyze website traffic. You can control cookie preferences through your browser settings.</p><h2>Data Protection</h2><p>We implement appropriate security measures to protect your personal information. We do not sell or share your data with third parties except as required by law.</p><h2>Contact</h2><p>For privacy-related inquiries, contact us at info@kingdomnetwork.com.np.</p>',
            'meta_title' => 'Privacy Policy | Kingdom Network',
            'meta_description' => 'Kingdom Network privacy policy - how we collect, use, and protect your personal information.',
            'schema_type' => 'PrivacyPolicy',
            'is_active' => true,
            'published_at' => now(),
        ]);

        Page::updateOrCreate(['slug' => 'terms'], [
            'title' => 'Terms of Service',
            'slug' => 'terms',
            'content' => '<h1>Terms of Service</h1><p>Last updated: ' . date('F j, Y') . '</p><h2>Acceptance of Terms</h2><p>By accessing and using this website, you agree to comply with and be bound by these Terms of Service.</p><h2>Intellectual Property</h2><p>All content on this website, including films, images, text, and trademarks, is the property of Kingdom Network and is protected by copyright laws.</p><h2>Use of Website</h2><p>You agree to use this website for lawful purposes only. You may not reproduce, distribute, or create derivative works without our prior written consent.</p><h2>Third-Party Links</h2><p>Our website may contain links to third-party websites. We are not responsible for the content or practices of these sites.</p><h2>Changes to Terms</h2><p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website.</p><h2>Contact</h2><p>For questions about these terms, contact us at info@kingdomnetwork.com.np.</p>',
            'meta_title' => 'Terms of Service | Kingdom Network',
            'meta_description' => 'Kingdom Network terms of service - guidelines for using our website and content.',
            'schema_type' => 'TermsOfService',
            'is_active' => true,
            'published_at' => now(),
        ]);
    }
}
