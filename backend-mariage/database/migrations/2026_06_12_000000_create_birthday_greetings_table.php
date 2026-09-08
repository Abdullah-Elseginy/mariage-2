<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('birthday_greetings', function (Blueprint $table): void {
            $table->id();
            $table->string('code', 4);
            $table->string('slug');
            $table->string('recipient_name', 120);
            $table->string('sender_name', 120);
            $table->boolean('is_published')->default(true);
            $table->string('locale', 8)->default('en');
            $table->json('content')->nullable();
            $table->timestamps();

            $table->unique(['slug', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('birthday_greetings');
    }
};
