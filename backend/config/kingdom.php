<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Module System - Enable/Disable Features
    |--------------------------------------------------------------------------
    | Each module is a self-contained feature that can be toggled on/off.
    | When disabled: routes hidden, menu items hidden, admin resources hidden.
    */

    'modules' => [
        'core'          => true,   // Home, About, Contact, Team, SEO - ALWAYS ON
        'films'         => true,   // Film catalog, detail, timeline, status badges
        'news'          => true,   // Press releases, blog, categories, tags
        'shop'          => false,  // Merch/e-commerce (Shopify or native)
        'membership'    => false,  // AAA24-style membership program
        'careers'       => true,   // Job board, applications
        'events'        => false,  // Premieres, festivals, screenings
        'podcasts'      => false,  // Audio content (like A24 Notes)
        'tv'            => false,  // Television division
        'comics'        => false,  // Comic/IP division (like Legendary)
        'gallery'       => true,   // Behind-the-scenes, production photos
        'press_kit'     => true,   // Downloadable assets for journalists
        'screening'     => false,  // Private screening requests
        'investors'     => false,  // Investor relations portal
        'newsletter'    => true,   // Email capture + campaigns
        'seo_sitemap'   => true,   // Auto sitemap, robots.txt, JSON-LD
        'awards'        => true,   // Awards & accolades page with wins/nominations
        'people'        => true,   // Individual cast/crew profile pages with filmography
        'search'        => true,   // Global search across all content types
    ],

    /*
    |--------------------------------------------------------------------------
    | Brand Identity - Extracted from Logo
    |--------------------------------------------------------------------------
    | Primary: #09333f (Dark Teal from logo)
    | Secondary: #516f78 (Mid Teal)
    | Accent: #7fa0a1 (Light Teal)
    | Gold: #ffcd57 (Awards/Highlights)
    */

    'brand' => [
        'name' => 'Kingdom Network',
        'tagline' => 'Redefining Nepali Cinema',
        'logo' => [
            'light' => '/storage/logos/logo-light.png',
            'dark'  => '/storage/logos/logo-dark.png',
            'favicon' => '/favicon.svg',
        ],
        'colors' => [
            'primary'   => '#09333f',  // Logo dark teal
            'secondary' => '#516f78',  // Logo mid teal
            'accent'    => '#7fa0a1',  // Logo light teal
            'gold'      => '#ffcd57',  // Awards
            'dark'      => '#08313c',  // Darker teal
            'surface'   => '#f9f6fe',  // Light lavender surface
            'white'     => '#ffffff',
            'text'      => '#1e293b',  // Slate-800
            'muted'     => '#67768e',  // Slate-500
        ],
        'fonts' => [
            'sans'    => 'Inter',
            'display' => 'Plus Jakarta Sans',
        ],
        'social' => [
            'facebook' => 'https://www.facebook.com/Kingdomntwork',
            'instagram' => 'https://instagram.com/kingdomnetwork',
            'twitter'  => 'https://twitter.com/kingdomnetwork',
            'youtube'  => 'https://youtube.com/@kingdomnetwork',
            'linkedin' => 'https://linkedin.com/company/kingdomnetwork',
        ],
        'contact' => [
            'address' => 'Kathmandu, Nepal',
            'phone'   => '+977-1-1234567',
            'email'   => 'info@kingdomnetwork.com.np',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Film Status Configuration
    |--------------------------------------------------------------------------
    */

    'film_statuses' => [
        'released'          => ['label' => 'Released', 'color' => 'green', 'icon' => 'heroicon-o-check-circle'],
        'post_production'   => ['label' => 'Post-Production', 'color' => 'blue', 'icon' => 'heroicon-o-film'],
        'pre_production'    => ['label' => 'Pre-Production', 'color' => 'yellow', 'icon' => 'heroicon-o-clapperboard'],
        'development'       => ['label' => 'Development', 'color' => 'purple', 'icon' => 'heroicon-o-pencil'],
        'announced'         => ['label' => 'Announced', 'color' => 'gray', 'icon' => 'heroicon-o-megaphone'],
        'cancelled'         => ['label' => 'Cancelled', 'color' => 'red', 'icon' => 'heroicon-o-x-circle'],
    ],

    /*
    |--------------------------------------------------------------------------
    | SEO Defaults
    |--------------------------------------------------------------------------
    */

    'seo' => [
        'default_title' => 'Kingdom Network - Redefining Nepali Cinema',
        'title_template' => '%s | Kingdom Network',
        'default_description' => 'Kingdom Network is a leading film production company in Nepal, creating world-class movies that blend authentic local storytelling with global filmmaking collaborations.',
        'default_image' => '/storage/seo/default-og.jpg',
        'twitter_handle' => '@kingdomnetwork',
        'organization' => [
            'name' => 'Kingdom Network',
            'url' => 'https://kingdomnetwork.com.np',
            'logo' => 'https://kingdomnetwork.com.np/storage/logos/logo-light.png',
            'sameAs' => [
                'https://www.facebook.com/Kingdomntwork',
                'https://instagram.com/kingdomnetwork',
                'https://twitter.com/kingdomnetwork',
                'https://youtube.com/@kingdomnetwork',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Pagination & API
    |--------------------------------------------------------------------------
    */

    'api' => [
        'default_per_page' => 12,
        'max_per_page' => 50,
    ],

    /*
    |--------------------------------------------------------------------------
    | Media Library Collections
    |--------------------------------------------------------------------------
    */

    'media_collections' => [
        'films' => [
            'poster' => 'film_poster',
            'banner' => 'film_banner',
            'gallery' => 'film_gallery',
            'trailer' => 'film_trailer',
        ],
        'team' => [
            'photo' => 'team_photo',
        ],
        'news' => [
            'featured' => 'news_featured',
        ],
        'gallery' => [
            'album_cover' => 'gallery_cover',
            'images' => 'gallery_images',
        ],
        'press' => [
            'assets' => 'press_assets',
            'logos' => 'press_logos',
        ],
        'site' => [
            'logo' => 'site_logo',
            'favicon' => 'site_favicon',
            'seo' => 'site_seo',
        ],
        'careers' => [
            'resume' => 'career_resume',
        ],
    ],

];