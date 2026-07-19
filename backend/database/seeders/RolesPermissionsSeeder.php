<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'view_dashboard',
            'manage_films',
            'manage_news',
            'manage_careers',
            'manage_gallery',
            'manage_press_kits',
            'manage_team',
            'manage_people',
            'manage_genres',
            'manage_media',
            'manage_banners',
            'manage_advertisements',
            'manage_menus',
            'manage_pages',
            'manage_modules',
            'manage_site_settings',
            'manage_newsletter',
            'manage_awards',
            'manage_search',
            'manage_testimonials',
            'manage_partners',
            'manage_users',
            'view_contact_submissions',
            'view_job_applications',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $superAdmin = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdmin->syncPermissions($permissions);

        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->syncPermissions(array_diff($permissions, ['manage_users', 'manage_modules', 'manage_site_settings']));

        $editor = Role::firstOrCreate(['name' => 'editor', 'guard_name' => 'web']);
        $editor->syncPermissions([
            'view_dashboard',
            'manage_films',
            'manage_news',
            'manage_careers',
            'manage_gallery',
            'manage_press_kits',
            'manage_team',
            'manage_people',
            'manage_genres',
            'manage_media',
            'manage_awards',
            'manage_testimonials',
            'manage_partners',
        ]);

        $viewer = Role::firstOrCreate(['name' => 'viewer', 'guard_name' => 'web']);
        $viewer->syncPermissions([
            'view_dashboard',
            'view_contact_submissions',
            'view_job_applications',
        ]);

        $adminUser = User::where('email', 'admin@kingdomnetwork.com.np')->first();
        if ($adminUser) {
            $adminUser->assignRole('super_admin');
        }
    }
}