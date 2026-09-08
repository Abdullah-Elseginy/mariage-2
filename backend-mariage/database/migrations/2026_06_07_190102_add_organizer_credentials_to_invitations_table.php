<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Invitation;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->string('organizer_username')->nullable()->after('is_published');
            $table->string('organizer_password')->nullable()->after('organizer_username');
        });

        // Backfill existing invitations with credentials
        $invitations = Invitation::all();
        foreach ($invitations as $invitation) {
            $groomName = $invitation->groom_name;
            $brideName = $invitation->bride_name;
            
            $groomEn = '';
            if (is_string($groomName)) {
                $decoded = json_decode($groomName, true);
                if (is_array($decoded)) {
                    $groomEn = $decoded['en'] ?? '';
                } else {
                    $groomEn = $groomName;
                }
            }
            
            $brideEn = '';
            if (is_string($brideName)) {
                $decoded = json_decode($brideName, true);
                if (is_array($decoded)) {
                    $brideEn = $decoded['en'] ?? '';
                } else {
                    $brideEn = $brideName;
                }
            }
            
            $username = Str::slug($groomEn . '-' . $brideEn);
            if (empty($username)) {
                $username = 'organizer-' . str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
            }
            
            $password = strtolower(Str::random(8));
            
            $invitation->update([
                'organizer_username' => $username,
                'organizer_password' => $password,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn(['organizer_username', 'organizer_password']);
        });
    }
};
