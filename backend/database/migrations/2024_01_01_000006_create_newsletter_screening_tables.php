<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->string('source')->default('footer');
            $table->enum('status', ['pending', 'confirmed', 'unsubscribed', 'bounced'])->default('pending');
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->json('tags')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('newsletter_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->string('preheader')->nullable();
            $table->longText('html_content');
            $table->longText('text_content')->nullable();
            $table->json('segment_tags')->nullable();
            $table->enum('status', ['draft', 'scheduled', 'sending', 'sent', 'failed'])->default('draft');
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->json('stats')->nullable();
            $table->timestamps();
        });

        Schema::create('screening_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('organization');
            $table->string('phone')->nullable();
            $table->foreignId('film_id')->constrained()->cascadeOnDelete();
            $table->string('venue_name');
            $table->text('venue_address');
            $table->date('preferred_date');
            $table->string('preferred_time')->nullable();
            $table->unsignedInteger('expected_attendees');
            $table->text('purpose')->nullable();
            $table->text('technical_requirements')->nullable();
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected', 'scheduled'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('screening_requests');
        Schema::dropIfExists('newsletter_campaigns');
        Schema::dropIfExists('newsletter_subscribers');
    }
};