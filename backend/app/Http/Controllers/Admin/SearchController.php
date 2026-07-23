<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Film;
use App\Models\Post;
use App\Models\Person;
use App\Models\TeamMember;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\ModuleSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $q = $request->input('q');
        $results = [];

        $adminPages = [
            ['type' => 'admin_page', 'id' => 0, 'title' => 'Dashboard', 'url' => '/admin', 'subtitle' => 'Admin dashboard'],
            ['type' => 'admin_page', 'id' => 1, 'title' => 'Media Library', 'url' => '/admin/media-library', 'subtitle' => 'Upload and manage media'],
            ['type' => 'admin_page', 'id' => 2, 'title' => 'Site Settings', 'url' => '/admin/site-settings', 'subtitle' => 'Site configuration'],
            ['type' => 'admin_page', 'id' => 3, 'title' => 'Modules', 'url' => '/admin/modules', 'subtitle' => 'Feature toggles'],
            ['type' => 'admin_page', 'id' => 4, 'title' => 'Films', 'url' => '/admin/films', 'subtitle' => 'Film catalog'],
            ['type' => 'admin_page', 'id' => 5, 'title' => 'News', 'url' => '/admin/news', 'subtitle' => 'News posts'],
            ['type' => 'admin_page', 'id' => 6, 'title' => 'Jobs', 'url' => '/admin/jobs', 'subtitle' => 'Job listings'],
            ['type' => 'admin_page', 'id' => 7, 'title' => 'Gallery', 'url' => '/admin/gallery', 'subtitle' => 'Photo albums'],
            ['type' => 'admin_page', 'id' => 8, 'title' => 'Press Kits', 'url' => '/admin/press-kits', 'subtitle' => 'Press resources'],
            ['type' => 'admin_page', 'id' => 9, 'title' => 'Team', 'url' => '/admin/team', 'subtitle' => 'Team members'],
            ['type' => 'admin_page', 'id' => 10, 'title' => 'People', 'url' => '/admin/people', 'subtitle' => 'Cast & crew'],
            ['type' => 'admin_page', 'id' => 11, 'title' => 'Genres', 'url' => '/admin/genres', 'subtitle' => 'Film genres'],
            ['type' => 'admin_page', 'id' => 12, 'title' => 'Banners', 'url' => '/admin/banners', 'subtitle' => 'Banner slider'],
            ['type' => 'admin_page', 'id' => 13, 'title' => 'Advertisements', 'url' => '/admin/advertisements', 'subtitle' => 'Ad management'],
            ['type' => 'admin_page', 'id' => 14, 'title' => 'Menu Management', 'url' => '/admin/menus', 'subtitle' => 'Navigation menus'],
            ['type' => 'admin_page', 'id' => 15, 'title' => 'Newsletter', 'url' => '/admin/newsletter', 'subtitle' => 'Email subscribers'],
            ['type' => 'admin_page', 'id' => 16, 'title' => 'Awards', 'url' => '/admin/awards', 'subtitle' => 'Awards & accolades'],
            ['type' => 'admin_page', 'id' => 17, 'title' => 'Search Settings', 'url' => '/admin/search', 'subtitle' => 'Search configuration'],
            ['type' => 'admin_page', 'id' => 18, 'title' => 'Pages', 'url' => '/admin/pages', 'subtitle' => 'Custom pages'],
            ['type' => 'admin_page', 'id' => 19, 'title' => 'Testimonials', 'url' => '/admin/testimonials', 'subtitle' => 'Testimonials'],
            ['type' => 'admin_page', 'id' => 20, 'title' => 'Partners', 'url' => '/admin/partners', 'subtitle' => 'Partners'],
            ['type' => 'admin_page', 'id' => 21, 'title' => 'Admin Users', 'url' => '/admin/users', 'subtitle' => 'User management'],
        ];

        if (!$q || strlen(trim($q)) < 2) {
            $results = collect($adminPages)->take(8)->values()->toArray();
            return response()->json(['data' => $results, 'total' => count($results)]);
        }

        $term = '%' . $q . '%';

        $matchedPages = collect($adminPages)->filter(fn($p) =>
            stripos($p['title'], $q) !== false || stripos($p['subtitle'], $q) !== false
        )->values();

        $films = Film::whereNotNull('published_at')
            ->where(function ($query) use ($term) {
                $query->where('title', 'like', $term)->orWhere('tagline', 'like', $term);
            })->get()->map(fn($f) => [
                'type' => 'film', 'id' => $f->id, 'title' => $f->title,
                'url' => '/admin/films/' . $f->id, 'subtitle' => $f->tagline,
            ]);

        $posts = Post::where('status', 'published')
            ->where(function ($query) use ($term) {
                $query->where('title', 'like', $term)->orWhere('excerpt', 'like', $term);
            })->get()->map(fn($n) => [
                'type' => 'news', 'id' => $n->id, 'title' => $n->title,
                'url' => '/admin/news/' . $n->id, 'subtitle' => 'News post',
            ]);

        $menus = Menu::where('name', 'like', $term)
            ->orWhere('location', 'like', $term)
            ->get()->map(fn($m) => [
                'type' => 'menu', 'id' => $m->id, 'title' => $m->name,
                'url' => '/admin/menus/' . $m->id, 'subtitle' => 'Menu: ' . $m->location,
            ]);

        $menuItems = MenuItem::where('label', 'like', $term)
            ->orWhere('url', 'like', $term)
            ->get()->map(fn($mi) => [
                'type' => 'menu_item', 'id' => $mi->id, 'title' => $mi->label,
                'url' => '/admin/menus/' . ($mi->menu_id ?? 0), 'subtitle' => $mi->url,
            ]);

        $pages = Page::where('title', 'like', $term)
            ->orWhere('slug', 'like', $term)
            ->get()->map(fn($p) => [
                'type' => 'page', 'id' => $p->id, 'title' => $p->title,
                'url' => '/admin/pages/' . $p->id, 'subtitle' => $p->slug,
            ]);

        $settings = SiteSetting::where('key', 'like', $term)
            ->get()->map(fn($s) => [
                'type' => 'setting', 'id' => $s->id, 'title' => $s->key,
                'url' => '/admin/site-settings', 'subtitle' => is_string($s->value) ? substr($s->value, 0, 60) : 'Setting value',
            ]);

        $modules = ModuleSetting::where('module_name', 'like', $term)
            ->get()->map(fn($m) => [
                'type' => 'module', 'id' => $m->id, 'title' => $m->module_name,
                'url' => '/admin/modules', 'subtitle' => $m->is_enabled ? 'Enabled' : 'Disabled',
            ]);

        $results = collect()
            ->merge($matchedPages)
            ->merge($films)
            ->merge($posts)
            ->merge($menus)
            ->merge($menuItems)
            ->merge($pages)
            ->merge($settings)
            ->merge($modules)
            ->take(20)
            ->values();

        return response()->json(['data' => $results, 'total' => $results->count()]);
    }
}