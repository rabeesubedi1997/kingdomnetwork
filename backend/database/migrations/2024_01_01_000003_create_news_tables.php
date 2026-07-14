<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("categories", function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("slug")->unique();
            $table->text("description")->nullable();
            $table->string("color")->nullable();
            $table->foreignId("parent_id")->nullable()->constrained("categories")->nullOnDelete();
            $table->timestamps();
        });

        Schema::create("posts", function (Blueprint $table) {
            $table->id();
            $table->string("slug")->unique();
            $table->string("title");
            $table->text("excerpt")->nullable();
            $table->longText("content")->nullable();
            $table->unsignedBigInteger("featured_image_id")->nullable();
            $table->unsignedBigInteger("author_id")->nullable();
            $table->foreignId("category_id")->nullable()->constrained("categories")->nullOnDelete();
            $table->enum("status", ["draft", "scheduled", "published", "archived"])->default("draft");
            $table->boolean("featured")->default(false);
            $table->unsignedInteger("reading_time")->nullable();
            $table->timestamp("published_at")->nullable();
            $table->string("seo_title")->nullable();
            $table->text("seo_description")->nullable();
            $table->string("schema_type")->default("NewsArticle");
            $table->timestamps();

            $table->index(["status", "published_at"]);
            $table->index("featured");
        });

        Schema::create("tags", function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("slug")->unique();
            $table->timestamps();
        });

        Schema::create("post_tag", function (Blueprint $table) {
            $table->id();
            $table->foreignId("post_id")->constrained()->cascadeOnDelete();
            $table->foreignId("tag_id")->constrained("tags")->cascadeOnDelete();
            $table->timestamps();
            $table->unique(["post_id", "tag_id"]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("post_tag");
        Schema::dropIfExists("tags");
        Schema::dropIfExists("categories");
        Schema::dropIfExists("posts");
    }
};