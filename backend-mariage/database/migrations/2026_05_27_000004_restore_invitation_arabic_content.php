<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $arabicNames = [
        'Omar' => 'عمر',
        'Salma' => 'سلمى',
        'Youssef' => 'يوسف',
        'Laila' => 'ليلى',
        'Karim' => 'كريم',
        'Nour' => 'نور',
    ];

    public function up(): void
    {
        DB::table('invitations')
            ->orderBy('id')
            ->each(function (object $invitation): void {
                $groom = $this->localizedString($invitation->groom_name);
                $bride = $this->localizedString($invitation->bride_name);
                $event = $this->localizedSection($invitation->event);
                $footer = $this->localizedSection($invitation->footer);

                $groom['ar'] = $this->arabicNames[$groom['en']] ?? $groom['ar'];
                $bride['ar'] = $this->arabicNames[$bride['en']] ?? $bride['ar'];

                $event['ar'] = [
                    ...$event['ar'],
                    'kicker' => 'تفاصيل الزفاف',
                    'title' => 'الموعد والمكان',
                    'day_label' => 'يوم الزفاف',
                    'date' => $this->arabicDate($event['en']['date'] ?? ''),
                    'description' => 'يسعدنا ويشرفنا أن تشاركونا هذه الليلة الجميلة مع عائلتينا.',
                    'time' => $this->arabicTime($event['en']['time'] ?? ''),
                    'venue_label' => 'قاعة الحفل',
                    'venue' => $this->arabicVenue($event['en']['venue'] ?? $event['ar']['venue'] ?? ''),
                    'location' => $this->arabicLocation($event['en']['location'] ?? $event['ar']['location'] ?? ''),
                    'address' => 'العنوان',
                    'landmark' => 'علامة مميزة',
                    'landmark_value' => $this->arabicLandmark($event['en']['landmark_value'] ?? $event['ar']['landmark_value'] ?? ''),
                    'open_location' => 'فتح الموقع',
                ];

                $footer['ar'] = [
                    ...$footer['ar'],
                    'date' => $this->arabicDate($footer['en']['date'] ?? $event['en']['date'] ?? ''),
                    'made_with' => 'صُنع بكل',
                    'for_day' => 'ليومنا المميز',
                ];

                DB::table('invitations')
                    ->where('id', $invitation->id)
                    ->update([
                        'groom_name' => json_encode($groom, JSON_UNESCAPED_UNICODE),
                        'bride_name' => json_encode($bride, JSON_UNESCAPED_UNICODE),
                        'couple_display_name' => json_encode([
                            'en' => "{$groom['en']} & {$bride['en']}",
                            'ar' => "{$groom['ar']} و {$bride['ar']}",
                        ], JSON_UNESCAPED_UNICODE),
                        'event' => json_encode($event, JSON_UNESCAPED_UNICODE),
                        'footer' => json_encode($footer, JSON_UNESCAPED_UNICODE),
                    ]);
            });
    }

    public function down(): void
    {
        // Data repair only. Do not overwrite user-facing content on rollback.
    }

    private function localizedString(?string $value): array
    {
        $decoded = json_decode((string) $value, true);
        if (is_array($decoded) && (array_key_exists('en', $decoded) || array_key_exists('ar', $decoded))) {
            return [
                'en' => (string) ($decoded['en'] ?? $decoded['ar'] ?? ''),
                'ar' => (string) ($decoded['ar'] ?? $decoded['en'] ?? ''),
            ];
        }

        $plain = trim((string) $value);

        return ['en' => $plain, 'ar' => $plain];
    }

    private function localizedSection(?string $value): array
    {
        $decoded = json_decode((string) $value, true);
        if (! is_array($decoded)) {
            return ['en' => [], 'ar' => []];
        }

        if (array_key_exists('en', $decoded) || array_key_exists('ar', $decoded)) {
            return [
                ...array_diff_key($decoded, ['en' => true, 'ar' => true]),
                'en' => is_array($decoded['en'] ?? null) ? $decoded['en'] : [],
                'ar' => is_array($decoded['ar'] ?? null) ? $decoded['ar'] : [],
            ];
        }

        return ['en' => $decoded, 'ar' => []];
    }

    private function arabicDate(string $date): string
    {
        return match ($date) {
            'Thursday, November 12, 2026' => 'الخميس، 12 نوفمبر 2026',
            'Saturday, December 5, 2026' => 'السبت، 5 ديسمبر 2026',
            default => 'الجمعة، 30 أكتوبر 2026',
        };
    }

    private function arabicTime(string $time): string
    {
        return trim($time) === '8:00 PM' ? '8:00 مساءً' : $time;
    }

    private function arabicVenue(string $venue): string
    {
        return match ($venue) {
            'Royal Hall' => 'قاعة رويال',
            'Royal Garden Venue' => 'قاعة الحديقة الملكية',
            'Moonlight Ballroom' => 'قاعة ضوء القمر',
            'Cleopatra Hall' => 'قاعة كليوباترا',
            default => $venue,
        };
    }

    private function arabicLocation(string $location): string
    {
        return match ($location) {
            'Tanta Center, Gharbia Governorate' => 'مركز طنطا، محافظة الغربية',
            'Qutour Center, Gharbia Governorate' => 'مركز قطور، محافظة الغربية',
            default => $location,
        };
    }

    private function arabicLandmark(string $landmark): string
    {
        return match ($landmark) {
            'Next to the bus station' => 'بجوار محطة الأتوبيس',
            'Next to the train station' => 'بجوار محطة القطار',
            default => $landmark,
        };
    }
};
