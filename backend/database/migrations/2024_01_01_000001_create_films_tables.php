<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("people", function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("slug")->unique();
            $table->string("role")->nullable();
            $table->text("bio")->nullable();
            $table->date("birth_date")->nullable();
            $table->string("birth_place")->nullable();
            $table->string("imdb_url")->nullable();
            $table->json("social_links")->nullable();
            $table->boolean("is_active")->default(true);
            $table->timestamps();
        });

        Schema::create("genres", function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("slug")->unique();
            $table->text("description")->nullable();
            $table->string("color")->nullable();
            $table->string("icon")->nullable();
            $table->timestamps();
        });

        Schema::create("films", function (Blueprint $table) {
            $table->id();
            $table->string("slug")->unique();
            $table->string("title");
            $table->string("tagline")->nullable();
            $table->text("synopsis")->nullable();
            $table->text("short_description")->nullable();
            $table->enum("status", ["released", "post_production", "pre_production", "development", "announced", "cancelled"])->default("development");
            $table->date("release_date")->nullable();
            $table->unsignedInteger("runtime_minutes")->nullable();
            $table->string("rating")->nullable();
            $table->string("language")->default("Nepali");
            $table->string("country")->default("Nepal");
            $table->unsignedBigInteger("budget")->nullable();
            $table->unsignedBigInteger("box_office")->nullable();
            $table->string("trailer_url")->nullable();
            $table->text("trailer_embed_code")->nullable();
            $table->foreignId("director_id")->nullable()->constrained("people")->nullOnDelete();
            $table->foreignId("producer_id")->nullable()->constrained("people")->nullOnDelete();
            $table->foreignId("writer_id")->nullable()->constrained("people")->nullOnDelete();
            $table->foreignId("cinematographer_id")->nullable()->constrained("people")->nullOnDelete();
            $table->foreignId("editor_id")->nullable()->constrained("people")->nullOnDelete();
            $table->foreignId("composer_id")->nullable()->constrained("people")->nullOnDelete();
            $table->boolean("is_featured")->default(false);
            $table->unsignedInteger("sort_order")->default(0);
            $table->timestamp("published_at")->nullable();
            $table->timestamps();

            $table->index(["status", "published_at"]);
            $table->index("is_featured");
        });

        Schema::create("film_genres", function (Blueprint $table) {
            $table->id();
            $table->foreignId("film_id")->constrained()->cascadeOnDelete();
            $table->foreignId("genre_id")->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(["film_id", "genre_id"]);
        });

        Schema::create("film_cast", function (Blueprint $table) {
            $table->id();
            $table->foreignId("film_id")->constrained()->cascadeOnDelete();
            $table->foreignId("person_id")->constrained("people")->cascadeOnDelete();
            $table->string("role_name");
            $table->boolean("is_lead")->default(false);
            $table->unsignedInteger("sort_order")->default(0);
            $table->timestamps();
        });

        Schema::create("film_crew", function (Blueprint $table) {
            $table->id();
            $table->foreignId("film_id")->constrained()->cascadeOnDelete();
            $table->foreignId("person_id")->constrained("people")->cascadeOnDelete();
            $table->string("department");
            $table->string("role");
            $table->unsignedInteger("sort_order")->default(0);
            $table->timestamps();
        });

        Schema::create("film_awards", function (Blueprint $table) {
            $table->id();
            $table->foreignId("film_id")->constrained()->cascadeOnDelete();
            $table->string("award_name");
            $table->string("category")->nullable();
            $table->unsignedInteger("year");
            $table->enum("result", ["won", "nominated", "shortlisted"])->default("nominated");
            $table->text("notes")->nullable();
            $table->timestamps();
        });

        Schema::create("film_locations", function (Blueprint $table) {
            $table->id();
            $table->foreignId("film_id")->constrained()->cascadeOnDelete();
            $table->string("location_name");
            $table->string("country")->nullable();
            $table->decimal("lat", 10, 8)->nullable();
            $table->decimal("lng", 11, 8)->nullable();
            $table->text("description")->nullable();
            $table->unsignedInteger("sort_order")->default(0);
            $table->timestamps();
        });

        Schema::create("film_gallery", function (Blueprint $table) {
            $table->id();
            $table->foreignId("film_id")->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger("media_id")->nullable();
            $table->text("caption")->nullable();
            $table->enum("type", ["poster", "still", "bts", "concept", "marketing"])->default("still");
            $table->unsignedInteger("sort_order")->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("film_gallery");
        Schema::dropIfExists("film_locations");
        Schema::dropIfExists("film_awards");
        Schema::dropIfExists("film_crew");
        Schema::dropIfExists("film_cast");
        Schema::dropIfExists("film_genres");
        Schema::dropIfExists("genres");
        Schema::dropIfExists("people");
        Schema::dropIfExists("films");
    }
};