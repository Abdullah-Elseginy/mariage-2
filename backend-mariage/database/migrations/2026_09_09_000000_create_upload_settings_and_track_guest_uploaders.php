<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('upload_settings', function (Blueprint $table): void {
            $table->id();
            $table->unsignedInteger('guest_image_max_kb')->default(350);
            $table->unsignedInteger('guest_max_images')->default(4);
            $table->unsignedInteger('gallery_image_max_kb')->default(500);
            $table->timestamps();
        });

        DB::table('upload_settings')->insert([
            'guest_image_max_kb' => 350,
            'guest_max_images' => 4,
            'gallery_image_max_kb' => 500,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Schema::table('guest_photos', function (Blueprint $table): void {
            $table->string('uploader_key', 64)->nullable()->after('guest_name');
            $table->index(['invitation_id', 'uploader_key']);
        });
    }

    public function down(): void
    {
        Schema::table('guest_photos', function (Blueprint $table): void {
            $table->dropIndex(['invitation_id', 'uploader_key']);
            $table->dropColumn('uploader_key');
        });

        Schema::dropIfExists('upload_settings');
    }
};
