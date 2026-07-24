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

    public function destroy(string $route): JsonResponse
    {
        PageSeo::where('route', $route)->delete();
        return response()->json(['message' => 'Deleted.']);
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
        $entries = PageSeo::all()->keyBy('route');
        $pages = [];

        foreach ($entries as $route => $seo) {
            $pages[$route] = [
                'route' => $route,
                'label' => $this->labelFromRoute($route),
                'group' => 'Static Pages',
                'default_title' => $this->labelFromRoute($route),
                'default_description' => '',
            ];
        }

        foreach (Film::whereNotNull('published_at')->get() as $model) {
            $route = '/films/' . $model->slug;
            $pages[$route] = [
                'route' => $route,
                'label' => $model->title,
                'group' => 'Films',
                'default_title' => $model->title,
                'default_description' => $model->short_description ?? $model->tagline ?? '',
            ];
        }
        foreach (Post::where('status', 'published')->get() as $model) {
            $route = '/news/' . $model->slug;
            $pages[$route] = [
                'route' => $route,
                'label' => $model->title,
                'group' => 'News',
                'default_title' => $model->title,
                'default_description' => $model->excerpt ?? '',
            ];
        }
        foreach (Person::all() as $model) {
            $route = '/people/' . $model->slug;
            $pages[$route] = [
                'route' => $route,
                'label' => $model->name,
                'group' => 'People',
                'default_title' => $model->name,
                'default_description' => $model->bio ?? '',
            ];
        }
        foreach (Page::where('is_active', true)->get() as $model) {
            $route = '/page/' . $model->slug;
            $pages[$route] = [
                'route' => $route,
                'label' => $model->title,
                'group' => 'Custom Pages',
                'default_title' => $model->title,
                'default_description' => '',
            ];
        }
        foreach (Album::all() as $model) {
            $route = '/gallery/' . $model->slug;
            $pages[$route] = [
                'route' => $route,
                'label' => $model->title,
                'group' => 'Gallery',
                'default_title' => $model->title,
                'default_description' => $model->description ?? '',
            ];
        }
        foreach (TeamMember::all() as $model) {
            $route = '/team/' . $model->id;
            $pages[$route] = [
                'route' => $route,
                'label' => $model->name,
                'group' => 'Team',
                'default_title' => $model->name,
                'default_description' => $model->role ?? '',
            ];
        }

        return array_values($pages);
    }

    private function labelFromRoute(string $route): string
    {
        $segment = trim($route, '/');
        if ($segment === '') return 'Home';
        return str_replace(['-', '_'], ' ', ucwords($segment, '/'));
    }
}
