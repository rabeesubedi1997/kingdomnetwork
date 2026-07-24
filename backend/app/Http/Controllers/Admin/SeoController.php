<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageSeo;
use App\Models\Film;
use App\Models\Post;
use App\Models\Person;
use App\Models\Album;
use App\Models\Job;
use App\Models\Page;
use App\Models\TeamMember;
use App\Models\PressKit;
use App\Models\Award;
use App\Models\Testimonial;
use App\Models\Partner;
use App\Models\NewsletterSubscriber;
use App\Models\ContactSubmission;
use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeoController extends Controller
{
    public function index(): JsonResponse
    {
        $pageSeos = PageSeo::orderBy('route')->get()->keyBy('route');

        $knownPages = $this->getKnownPages();

        $pages = collect($knownPages)->map(function ($page) use ($pageSeos) {
            $seo = $pageSeos->get($page['route']);
            return array_merge($page, [
                'seo' => $seo ? [
                    'id' => $seo->id,
                    'title' => $seo->title,
                    'description' => $seo->description,
                    'og_title' => $seo->og_title,
                    'og_description' => $seo->og_description,
                    'og_image' => $seo->og_image,
                    'noindex' => $seo->noindex,
                    'canonical_url' => $seo->canonical_url,
                    'schema_type' => $seo->schema_type,
                ] : null,
            ]);
        })->values();

        return response()->json(['data' => $pages]);
    }

    public function update(Request $request, string $route): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string|max:500',
            'og_image' => 'nullable|string|max:500',
            'noindex' => 'boolean',
            'canonical_url' => 'nullable|string|max:500',
            'schema_type' => 'nullable|string|max:100',
        ]);

        $pageSeo = PageSeo::updateOrCreate(
            ['route' => $route],
            $validated
        );

        return response()->json(['data' => $pageSeo]);
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        $entries = $request->validate([
            'entries' => 'required|array',
            'entries.*.route' => 'required|string',
            'entries.*.title' => 'nullable|string|max:255',
            'entries.*.description' => 'nullable|string|max:500',
            'entries.*.og_title' => 'nullable|string|max:255',
            'entries.*.og_description' => 'nullable|string|max:500',
            'entries.*.og_image' => 'nullable|string|max:500',
            'entries.*.noindex' => 'boolean',
            'entries.*.canonical_url' => 'nullable|string|max:500',
            'entries.*.schema_type' => 'nullable|string|max:100',
        ]);

        foreach ($entries['entries'] as $entry) {
            PageSeo::updateOrCreate(
                ['route' => $entry['route']],
                collect($entry)->except('route')->toArray()
            );
        }

        return response()->json(['message' => 'SEO entries updated successfully.']);
    }

    private function getKnownPages(): array
    {
        $pages = [
            ['route' => '/', 'label' => 'Home', 'group' => 'Static Pages', 'default_title' => 'Home', 'default_description' => 'Kingdom Network is a leading film and media production company in Nepal.'],
            ['route' => '/about', 'label' => 'About Us', 'group' => 'Static Pages', 'default_title' => 'About Us', 'default_description' => 'Learn about Kingdom Network\'s mission, team, and journey in Nepali cinema.'],
            ['route' => '/films', 'label' => 'Films', 'group' => 'Static Pages', 'default_title' => 'Films', 'default_description' => 'Explore our complete filmography and upcoming productions.'],
            ['route' => '/news', 'label' => 'News', 'group' => 'Static Pages', 'default_title' => 'News', 'default_description' => 'Latest news, announcements, and behind-the-scenes stories from Kingdom Network.'],
            ['route' => '/contact', 'label' => 'Contact', 'group' => 'Static Pages', 'default_title' => 'Contact', 'default_description' => 'Get in touch with Kingdom Network.'],
            ['route' => '/careers', 'label' => 'Careers', 'group' => 'Static Pages', 'default_title' => 'Careers', 'default_description' => 'Join our team and be part of Nepal\'s leading film production company.'],
            ['route' => '/gallery', 'label' => 'Gallery', 'group' => 'Static Pages', 'default_title' => 'Gallery', 'default_description' => 'Behind-the-scenes moments, production stills, and exclusive content.'],
            ['route' => '/press', 'label' => 'Press', 'group' => 'Static Pages', 'default_title' => 'Press', 'default_description' => 'Press kits and media resources for journalists.'],
            ['route' => '/awards', 'label' => 'Awards', 'group' => 'Static Pages', 'default_title' => 'Awards', 'default_description' => 'Awards and accolades received by Kingdom Network.'],
            ['route' => '/people', 'label' => 'People', 'group' => 'Static Pages', 'default_title' => 'People', 'default_description' => 'Cast and crew of Kingdom Network productions.'],
            ['route' => '/team', 'label' => 'Team', 'group' => 'Static Pages', 'default_title' => 'Team', 'default_description' => 'Meet the Kingdom Network team.'],
            ['route' => '/privacy', 'label' => 'Privacy Policy', 'group' => 'Legal', 'default_title' => 'Privacy Policy', 'default_description' => 'Privacy policy for Kingdom Network.'],
            ['route' => '/terms', 'label' => 'Terms of Service', 'group' => 'Legal', 'default_title' => 'Terms of Service', 'default_description' => 'Terms and conditions for using Kingdom Network.'],
        ];

        $dynamicPages = [];
        foreach (Film::whereNotNull('published_at')->get() as $film) {
            $dynamicPages[] = [
                'route' => '/films/' . $film->slug,
                'label' => $film->title,
                'group' => 'Films',
                'default_title' => $film->title,
                'default_description' => $film->short_description ?? $film->tagline ?? '',
            ];
        }
        foreach (Post::where('status', 'published')->get() as $post) {
            $dynamicPages[] = [
                'route' => '/news/' . $post->slug,
                'label' => $post->title,
                'group' => 'News',
                'default_title' => $post->title,
                'default_description' => $post->excerpt ?? '',
            ];
        }
        foreach (Person::all() as $person) {
            $dynamicPages[] = [
                'route' => '/people/' . $person->slug,
                'label' => $person->name,
                'group' => 'People',
                'default_title' => $person->name,
                'default_description' => $person->bio ?? '',
            ];
        }
        foreach (Page::where('is_active', true)->get() as $page) {
            $dynamicPages[] = [
                'route' => '/page/' . $page->slug,
                'label' => $page->title,
                'group' => 'Custom Pages',
                'default_title' => $page->title,
                'default_description' => '',
            ];
        }
        foreach (Album::all() as $album) {
            $dynamicPages[] = [
                'route' => '/gallery/' . $album->slug,
                'label' => $album->title,
                'group' => 'Gallery',
                'default_title' => $album->title,
                'default_description' => $album->description ?? '',
            ];
        }
        foreach (TeamMember::all() as $member) {
            $dynamicPages[] = [
                'route' => '/team/' . $member->id,
                'label' => $member->name,
                'group' => 'Team',
                'default_title' => $member->name,
                'default_description' => $member->role ?? '',
            ];
        }

        return array_merge($pages, $dynamicPages);
    }
}
