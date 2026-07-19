<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageSection extends Model
{
    protected $fillable = [
        'page_id',
        'section_type',
        'title',
        'config',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'config' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    public static function getAvailableTypes(): array
    {
        return [
            'hero_banner' => ['label' => 'Hero Banner', 'module' => 'core', 'icon' => 'Image'],
            'film_grid' => ['label' => 'Film Grid', 'module' => 'films', 'icon' => 'Film'],
            'featured_film' => ['label' => 'Featured Film', 'module' => 'films', 'icon' => 'Film'],
            'film_status_tabs' => ['label' => 'Film Status Tabs', 'module' => 'films', 'icon' => 'Film'],
            'film_carousel' => ['label' => 'Film Carousel', 'module' => 'films', 'icon' => 'Film'],
            'news_feed' => ['label' => 'News Feed', 'module' => 'news', 'icon' => 'Newspaper'],
            'featured_news' => ['label' => 'Featured News', 'module' => 'news', 'icon' => 'Newspaper'],
            'gallery_albums' => ['label' => 'Gallery Albums', 'module' => 'gallery', 'icon' => 'Images'],
            'team_grid' => ['label' => 'Team Grid', 'module' => 'core', 'icon' => 'Users'],
            'people_grid' => ['label' => 'People Grid', 'module' => 'people', 'icon' => 'UserCircle'],
            'awards_display' => ['label' => 'Awards Display', 'module' => 'awards', 'icon' => 'Trophy'],
            'press_kit_list' => ['label' => 'Press Kit List', 'module' => 'press_kit', 'icon' => 'FileText'],
            'contact_form' => ['label' => 'Contact Form', 'module' => 'core', 'icon' => 'Mail'],
            'newsletter_signup' => ['label' => 'Newsletter Signup', 'module' => 'newsletter', 'icon' => 'Mail'],
            'stats_counters' => ['label' => 'Stats Counters', 'module' => 'core', 'icon' => 'TrendingUp'],
            'custom_html' => ['label' => 'Custom HTML', 'module' => 'core', 'icon' => 'Code'],
            'about_preview' => ['label' => 'About Preview', 'module' => 'core', 'icon' => 'FileText'],
            'careers_list' => ['label' => 'Careers List', 'module' => 'careers', 'icon' => 'Briefcase'],
            'testimonials_carousel' => ['label' => 'Testimonials Carousel', 'module' => 'core', 'icon' => 'MessageSquare'],
            'partners_showcase' => ['label' => 'Partners Showcase', 'module' => 'core', 'icon' => 'Briefcase'],
        ];
    }
}
