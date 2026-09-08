<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table): void {
            $table->text('groom_name')->change();
            $table->text('bride_name')->change();
            $table->text('couple_display_name')->change();
        });
    }

    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table): void {
            $table->string('groom_name', 120)->change();
            $table->string('bride_name', 120)->change();
            $table->string('couple_display_name', 180)->change();
        });
    }
};
