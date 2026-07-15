<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('team_members', function (Blueprint $table) {
            $table->string('email')->nullable()->after('photo_id');
            $table->string('phone')->nullable()->after('email');
            $table->date('birth_date')->nullable()->after('phone');
            $table->string('birth_place')->nullable()->after('birth_date');
            $table->string('imdb_url')->nullable()->after('birth_place');
            $table->string('instagram_url')->nullable()->after('imdb_url');
            $table->string('twitter_url')->nullable()->after('instagram_url');
            $table->string('linkedin_url')->nullable()->after('twitter_url');
            $table->string('website_url')->nullable()->after('linkedin_url');
        });
    }

    public function down(): void
    {
        Schema::table('team_members', function (Blueprint $table) {
            $table->dropColumn([
                'email', 'phone', 'birth_date', 'birth_place', 'imdb_url',
                'instagram_url', 'twitter_url', 'linkedin_url', 'website_url',
            ]);
        });
    }
};
