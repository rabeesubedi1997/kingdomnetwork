<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("albums", function (Blueprint $table) {
            $table->id();
            $table->string("slug")->unique();
            $table->string("title");
            $table->text("description")->nullable();
            $table->unsignedBigInteger("cover_id")->nullable();
            $table->enum("category", ["behind_the_scenes", "posters", "stills", "events", "concept_art", "marketing"]);
            $table->foreignId("film_id")->nullable()->constrained()->nullOnDelete();
            $table->foreignId("event_id")->nullable()->constrained("events")->nullOnDelete();
            $table->boolean("is_public")->default(true);
            $table->unsignedInteger("sort_order")->default(0);
            $table->timestamps();
        });

        Schema::create("album_images", function (Blueprint $table) {
            $table->id();
            $table->foreignId("album_id")->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger("media_id")->nullable();
            $table->text("caption")->nullable();
            $table->unsignedInteger("sort_order")->default(0);
            $table->timestamps();
        });

        Schema::create("press_kits", function (Blueprint $table) {
            $table->id();
            $table->foreignId("film_id")->constrained()->cascadeOnDelete();
            $table->string("title");
            $table->string("slug")->unique();
            $table->text("logline")->nullable();
            $table->text("synopsis_short")->nullable();
            $table->longText("synopsis_long")->nullable();
            $table->json("key_cast")->nullable();
            $table->json("key_crew")->nullable();
            $table->json("technical_specs")->nullable();
            $table->json("festival_history")->nullable();
            $table->json("awards")->nullable();
            $table->json("assets")->nullable();
            $table->string("contact_email")->nullable();
            $table->string("contact_phone")->nullable();
            $table->boolean("is_public")->default(true);
            $table->string("password")->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("press_kits");
        Schema::dropIfExists("album_images");
        Schema::dropIfExists("albums");
    }
};