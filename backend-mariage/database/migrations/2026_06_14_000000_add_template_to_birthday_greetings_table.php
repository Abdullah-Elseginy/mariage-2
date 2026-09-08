<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('birthday_greetings', function (Blueprint $table): void {
            if (! Schema::hasColumn('birthday_greetings', 'template')) {
                $table->string('template', 32)->default('default')->after('locale');
            }
        });
    }

    public function down(): void
    {
        Schema::table('birthday_greetings', function (Blueprint $table): void {
            if (Schema::hasColumn('birthday_greetings', 'template')) {
                $table->dropColumn('template');
            }
        });
    }
};
