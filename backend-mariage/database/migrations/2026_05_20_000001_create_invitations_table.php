<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invitations', function (Blueprint $table): void {
            $table->id();
            $table->string('code', 4);
            $table->string('slug');
            $table->string('groom_name', 120);
            $table->string('bride_name', 120);
            $table->string('couple_display_name', 180);
            $table->boolean('is_published')->default(true);
            $table->json('hero')->nullable();
            $table->json('loading')->nullable();
            $table->json('event')->nullable();
            $table->json('love_story')->nullable();
            $table->json('gallery')->nullable();
            $table->json('countdown')->nullable();
            $table->json('rsvp')->nullable();
            $table->json('footer')->nullable();
            $table->timestamps();

            $table->unique(['slug', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitations');
    }
};
