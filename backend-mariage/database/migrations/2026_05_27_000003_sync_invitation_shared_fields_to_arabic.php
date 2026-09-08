<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('invitations')
            ->orderBy('id')
            ->each(function (object $invitation): void {
                DB::table('invitations')
                    ->where('id', $invitation->id)
                    ->update([
                        'groom_name' => $this->syncLocalizedString($invitation->groom_name),
                        'bride_name' => $this->syncLocalizedString($invitation->bride_name),
                        'couple_display_name' => $this->syncLocalizedString($invitation->couple_display_name),
                        'event' => $this->syncLocalizedSection($invitation->event, [
                            'date',
                            'time',
                            'venue',
                            'location',
                            'landmark_value',
                            'map_title',
                            'map_url',
                        ]),
                        'footer' => $this->syncLocalizedSection($invitation->footer, ['date']),
                    ]);
            });
    }

    public function down(): void
    {
        // Data sync only. Do not undo user-facing content changes.
    }

    private function syncLocalizedString(?string $value): string
    {
        $decoded = json_decode((string) $value, true);
        if (! $this->isLocalized($decoded)) {
            return (string) $value;
        }

        $english = (string) ($decoded['en'] ?? $decoded['ar'] ?? '');
        $decoded['ar'] = $english;

        return json_encode($decoded, JSON_UNESCAPED_UNICODE);
    }

    private function syncLocalizedSection(?string $value, array $fields): string
    {
        $decoded = json_decode((string) $value, true);
        if (! $this->isLocalized($decoded)) {
            return (string) $value;
        }

        $decoded['en'] = is_array($decoded['en'] ?? null) ? $decoded['en'] : [];
        $decoded['ar'] = is_array($decoded['ar'] ?? null) ? $decoded['ar'] : [];

        foreach ($fields as $field) {
            if (array_key_exists($field, $decoded['en'])) {
                $decoded['ar'][$field] = $decoded['en'][$field];
            } elseif (array_key_exists($field, $decoded)) {
                $decoded['ar'][$field] = $decoded[$field];
            }
        }

        return json_encode($decoded, JSON_UNESCAPED_UNICODE);
    }

    private function isLocalized(mixed $value): bool
    {
        return is_array($value) && (array_key_exists('en', $value) || array_key_exists('ar', $value));
    }
};
