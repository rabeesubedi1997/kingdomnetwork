<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("jobs", function (Blueprint $table) {
            $table->id();
            $table->string("slug")->unique();
            $table->string("title");
            $table->string("department");
            $table->enum("type", ["full_time", "part_time", "contract", "internship", "freelance"]);
            $table->string("location")->default("Kathmandu, Nepal");
            $table->text("description");
            $table->text("requirements");
            $table->text("benefits")->nullable();
            $table->string("salary_range")->nullable();
            $table->boolean("is_remote")->default(false);
            $table->boolean("is_open")->default(true);
            $table->unsignedInteger("sort_order")->default(0);
            $table->timestamp("closes_at")->nullable();
            $table->timestamp("published_at")->nullable();
            $table->timestamps();

            $table->index(["is_open", "published_at"]);
        });

        Schema::create("job_applications", function (Blueprint $table) {
            $table->id();
            $table->foreignId("job_id")->constrained()->cascadeOnDelete();
            $table->string("name");
            $table->string("email");
            $table->string("phone")->nullable();
            $table->text("cover_letter")->nullable();
            $table->unsignedBigInteger("resume_id")->nullable(); // No FK - media table from Spatie
            $table->string("portfolio_url")->nullable();
            $table->string("linkedin_url")->nullable();
            $table->enum("status", ["submitted", "reviewing", "interviewed", "offered", "rejected", "hired"])->default("submitted");
            $table->text("notes")->nullable();
            $table->timestamps();
        });

        Schema::create("events", function (Blueprint $table) {
            $table->id();
            $table->string("slug")->unique();
            $table->string("title");
            $table->text("description")->nullable();
            $table->enum("event_type", ["premiere", "festival", "screening", "panel", "workshop", "party"]);
            $table->dateTime("start_datetime");
            $table->dateTime("end_datetime")->nullable();
            $table->string("venue_name");
            $table->text("venue_address")->nullable();
            $table->string("venue_city")->nullable();
            $table->string("venue_country")->nullable();
            $table->decimal("lat", 10, 8)->nullable();
            $table->decimal("lng", 11, 8)->nullable();
            $table->foreignId("film_id")->nullable()->constrained()->nullOnDelete();
            $table->unsignedBigInteger("poster_id")->nullable(); // No FK - media table
            $table->string("ticket_url")->nullable();
            $table->boolean("is_public")->default(true);
            $table->boolean("rsvp_required")->default(false);
            $table->unsignedInteger("max_attendees")->nullable();
            $table->timestamps();
        });

        Schema::create("event_rsvps", function (Blueprint $table) {
            $table->id();
            $table->foreignId("event_id")->constrained()->cascadeOnDelete();
            $table->string("name");
            $table->string("email");
            $table->string("phone")->nullable();
            $table->unsignedInteger("guests")->default(1);
            $table->text("message")->nullable();
            $table->enum("status", ["pending", "confirmed", "declined", "waitlisted"])->default("pending");
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("event_rsvps");
        Schema::dropIfExists("events");
        Schema::dropIfExists("job_applications");
        Schema::dropIfExists("jobs");
    }
};