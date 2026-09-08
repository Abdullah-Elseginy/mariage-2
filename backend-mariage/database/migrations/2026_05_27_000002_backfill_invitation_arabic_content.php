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
                $groom = $this->localizedName($invitation->groom_name);
                $bride = $this->localizedName($invitation->bride_name);
                $event = $this->json($invitation->event);

                DB::table('invitations')
                    ->where('id', $invitation->id)
                    ->update([
                        'groom_name' => $this->encodeName($groom),
                        'bride_name' => $this->encodeName($bride),
                        'couple_display_name' => json_encode([
                            'en' => $this->plain($invitation->couple_display_name) ?: "{$groom['en']} & {$bride['en']}",
                            'ar' => "{$groom['ar']} و {$bride['ar']}",
                        ], JSON_UNESCAPED_UNICODE),
                        'loading' => $this->localizedJson($invitation->loading, [
                            'prompt_kicker' => 'الدعوة جاهزة',
                            'open_prompt' => 'افتح جواب الدعوة',
                        ]),
                        'hero' => $this->localizedJson($invitation->hero, [
                            'open_invitation' => 'افتح دعوة الزفاف',
                            'open' => 'افتح',
                            'kicker' => 'نحن على موعد مع الزفاف',
                            'body' => 'بمشاركة عائلتينا، ندعوكم للاحتفال معنا بزفافنا.',
                            'save_date' => 'احفظ التاريخ',
                            'view_details' => 'عرض التفاصيل',
                        ]),
                        'event' => $this->localizedJson($invitation->event, [
                            'kicker' => 'تفاصيل الزفاف',
                            'title' => 'الموعد والمكان',
                            'day_label' => 'يوم الزفاف',
                            'date' => $this->arabicDate($event['date'] ?? ''),
                            'description' => 'يسعدنا ويشرفنا أن تشاركونا هذه الليلة الجميلة مع عائلتينا.',
                            'time' => '8:00 مساءً',
                            'venue_label' => 'قاعة الحفل',
                            'venue' => $this->arabicVenue($event['venue'] ?? ''),
                            'location' => 'مركز قطور، محافظة الغربية',
                            'address' => 'العنوان',
                            'landmark' => 'علامة مميزة',
                            'landmark_value' => 'بجوار محطة القطار',
                            'open_location' => 'فتح الموقع',
                            'map_title' => 'خرائط جوجل',
                        ]),
                        'love_story' => $this->localizedJson($invitation->love_story, [
                            'kicker' => 'الرحلة',
                            'title' => 'قصة حبنا',
                            'events' => [
                                ['date' => '30/1/2026', 'title' => 'أول لقاء', 'desc' => 'كانت البداية بكلمة مرحباً هادئة صنعت كل شيء.'],
                                ['date' => '13/2/2026', 'title' => 'الخطوبة', 'desc' => 'أصبح الوعد رسمياً وبدأ فصل جديد من الحكاية.'],
                            ],
                        ]),
                        'gallery' => $this->localizedJson($invitation->gallery, [
                            'title' => 'ذكريات',
                        ], ['image_urls']),
                        'countdown' => $this->localizedJson($invitation->countdown, [
                            'title' => 'العد التنازلي',
                            'finished' => 'اليوم هو يوم الزفاف!',
                        ], ['target_date']),
                        'rsvp' => $this->localizedJson($invitation->rsvp, [
                            'kicker' => 'تأكيد الحضور',
                            'title' => 'هل ستحضر؟',
                            'name' => 'الاسم بالكامل',
                            'name_placeholder' => 'اكتب اسمك',
                            'attending' => 'هل ستتمكن من الحضور؟',
                            'submit' => 'إرسال الرد',
                            'yes' => 'نعم، سأحضر',
                            'no' => 'لا، لن أتمكن من الحضور',
                            'message' => 'رسالة اختيارية',
                            'message_placeholder' => 'اكتب تهنئتك...',
                            'thanks' => 'شكراً لك، {{name}}!',
                            'yes_reply' => 'ننتظر الاحتفال معك بكل فرح!',
                            'no_reply' => 'نأسف لعدم حضورك، وستبقى في قلوبنا.',
                        ]),
                        'footer' => $this->localizedJson($invitation->footer, [
                            'date' => $this->arabicDate($this->json($invitation->footer)['date'] ?? ''),
                            'made_with' => 'صُنع بكل',
                            'for_day' => 'ليومنا المميز',
                        ]),
                        'audio' => $this->localizedJson($invitation->audio, [
                            'play' => 'تشغيل الموسيقى',
                            'pause' => 'إيقاف الموسيقى',
                        ], ['src', 'volume']),
                    ]);
            });
    }

    public function down(): void
    {
        // This is a data backfill. Keeping localized data on rollback avoids losing user edits.
    }

    private function localizedJson(?string $value, array $arabic, array $sharedKeys = []): string
    {
        $data = $this->json($value);

        if ($this->isLocalized($data)) {
            return json_encode($data, JSON_UNESCAPED_UNICODE);
        }

        $shared = [];
        foreach ($sharedKeys as $key) {
            if (array_key_exists($key, $data)) {
                $shared[$key] = $data[$key];
                unset($data[$key], $arabic[$key]);
            }
        }

        return json_encode([
            ...$shared,
            'en' => $data,
            'ar' => $arabic,
        ], JSON_UNESCAPED_UNICODE);
    }

    private function localizedName(?string $value): array
    {
        $decoded = json_decode((string) $value, true);
        if ($this->isLocalized($decoded)) {
            return [
                'en' => (string) ($decoded['en'] ?? $decoded['ar'] ?? ''),
                'ar' => (string) ($decoded['ar'] ?? $decoded['en'] ?? ''),
            ];
        }

        $english = trim((string) $value);

        return [
            'en' => $english,
            'ar' => $this->arabicNames[$english] ?? $english,
        ];
    }

    private function encodeName(array $name): string
    {
        return $name['en'] === $name['ar']
            ? $name['en']
            : json_encode($name, JSON_UNESCAPED_UNICODE);
    }

    private function json(?string $value): array
    {
        $decoded = json_decode((string) $value, true);

        return is_array($decoded) ? $decoded : [];
    }

    private function isLocalized(mixed $value): bool
    {
        return is_array($value) && (array_key_exists('en', $value) || array_key_exists('ar', $value));
    }

    private function plain(?string $value): string
    {
        $decoded = json_decode((string) $value, true);

        if ($this->isLocalized($decoded)) {
            return (string) ($decoded['en'] ?? $decoded['ar'] ?? '');
        }

        return trim((string) $value);
    }

    private function arabicDate(string $date): string
    {
        return match ($date) {
            'Thursday, November 12, 2026' => 'الخميس، 12 نوفمبر 2026',
            'Saturday, December 5, 2026' => 'السبت، 5 ديسمبر 2026',
            default => 'الجمعة، 30 أكتوبر 2026',
        };
    }

    private function arabicVenue(string $venue): string
    {
        return match ($venue) {
            'Royal Garden Venue' => 'قاعة الحديقة الملكية',
            'Moonlight Ballroom' => 'قاعة ضوء القمر',
            default => 'قاعة كليوباترا',
        };
    }
};
