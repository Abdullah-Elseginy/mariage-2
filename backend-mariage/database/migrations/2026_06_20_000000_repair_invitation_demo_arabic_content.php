<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $names = [
        'Omar' => 'عمر',
        'Salma' => 'سلمى',
        'Youssef' => 'يوسف',
        'Laila' => 'ليلى',
        'Karim' => 'كريم',
        'Nour' => 'نور',
    ];

    public function up(): void
    {
        if (in_array(DB::getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement('ALTER TABLE invitations CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        }

        $query = DB::table('invitations')->where(function ($query): void {
            $query->where('slug', 'like', 'demo%')
                ->orWhere(function ($knownDemos): void {
                    $knownDemos->whereIn('code', ['2417', '5820', '9046'])
                        ->whereIn('slug', ['omar-salma', 'youssef-laila', 'karim-nour']);
                });

            if (Schema::hasColumn('invitations', 'is_demo')) {
                $query->orWhere('is_demo', true);
            }
        });

        $query->orderBy('id')->each(function (object $invitation): void {
            $groom = $this->localizedString($invitation->groom_name);
            $bride = $this->localizedString($invitation->bride_name);
            $groomArabic = $this->names[$groom['en']] ?? $groom['en'];
            $brideArabic = $this->names[$bride['en']] ?? $bride['en'];
            $eventEnglish = $this->englishSection($invitation->event);

            DB::table('invitations')->where('id', $invitation->id)->update([
                'groom_name' => $this->encodeLocalized($groom['en'], $groomArabic),
                'bride_name' => $this->encodeLocalized($bride['en'], $brideArabic),
                'couple_display_name' => json_encode([
                    'en' => "{$groom['en']} & {$bride['en']}",
                    'ar' => "{$groomArabic} و {$brideArabic}",
                ], JSON_UNESCAPED_UNICODE),
                'loading' => $this->replaceArabic($invitation->loading, [
                    'prompt_kicker' => 'الدعوة جاهزة',
                    'open_prompt' => 'افتح جواب الدعوة',
                ]),
                'hero' => $this->replaceArabic($invitation->hero, [
                    'open_invitation' => 'افتح دعوة الزفاف',
                    'open' => 'افتح',
                    'kicker' => 'نحن على موعد مع الزفاف',
                    'body' => 'بمشاركة عائلتينا، ندعوكم للاحتفال معنا بزفافنا.',
                    'save_date' => 'احفظ التاريخ',
                    'view_details' => 'عرض التفاصيل',
                ]),
                'event' => $this->replaceArabic($invitation->event, [
                    'kicker' => 'تفاصيل الزفاف',
                    'title' => 'الموعد والمكان',
                    'day_label' => 'يوم الزفاف',
                    'date' => $this->arabicDate((string) ($eventEnglish['date'] ?? '')),
                    'description' => 'يسعدنا ويشرفنا أن تشاركونا هذه الليلة الجميلة مع عائلتينا.',
                    'time' => $this->arabicTime((string) ($eventEnglish['time'] ?? '')),
                    'venue_label' => 'قاعة الحفل',
                    'venue' => $this->arabicVenue((string) ($eventEnglish['venue'] ?? '')),
                    'location' => $this->arabicLocation((string) ($eventEnglish['location'] ?? '')),
                    'address' => 'العنوان',
                    'landmark' => 'علامة مميزة',
                    'landmark_value' => $this->arabicLandmark((string) ($eventEnglish['landmark_value'] ?? '')),
                    'open_location' => 'فتح الموقع',
                    'map_title' => 'خرائط جوجل',
                ]),
                'love_story' => $this->replaceArabic($invitation->love_story, [
                    'kicker' => 'الرحلة',
                    'title' => 'قصة حبنا',
                    'events' => [
                        ['date' => '30/1/2026', 'title' => 'أول لقاء', 'desc' => 'كانت البداية بكلمة مرحبًا هادئة صنعت كل شيء.'],
                        ['date' => '13/2/2026', 'title' => 'الخطوبة', 'desc' => 'أصبح الوعد رسميًا وبدأ فصل جديد من الحكاية.'],
                    ],
                ]),
                'gallery' => $this->replaceArabic($invitation->gallery, [
                    'title' => 'ذكرياتنا',
                ]),
                'countdown' => $this->replaceArabic($invitation->countdown, [
                    'title' => 'العد التنازلي',
                    'finished' => 'اليوم هو يوم الزفاف!',
                ]),
                'rsvp' => $this->replaceArabic($invitation->rsvp, [
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
                    'thanks' => 'شكرًا لك، {{name}}!',
                    'yes_reply' => 'ننتظر الاحتفال معك بكل فرح!',
                    'no_reply' => 'نأسف لعدم حضورك، وستبقى في قلوبنا.',
                ]),
                'footer' => $this->replaceArabic($invitation->footer, [
                    'date' => $this->arabicDate((string) ($eventEnglish['date'] ?? '')),
                    'made_with' => 'صُنع بكل حب',
                    'for_day' => 'ليومنا المميز',
                ]),
                'audio' => $this->replaceArabic($invitation->audio, [
                    'play' => 'تشغيل الموسيقى',
                    'pause' => 'إيقاف الموسيقى',
                ]),
                'party_upload' => $this->replaceArabic($invitation->party_upload, [
                    'title' => 'شاركنا صورك',
                    'description' => 'ارفع صورك من الحفل لتبقى ضمن ذكرياتنا الجميلة.',
                    'button' => 'اختر الصور',
                    'success' => 'تم رفع الصور بنجاح.',
                ]),
            ]);
        });
    }

    public function down(): void
    {
        // Data repair only.
    }

    private function localizedString(?string $value): array
    {
        $decoded = json_decode((string) $value, true);
        if (is_array($decoded)) {
            $english = trim((string) ($decoded['en'] ?? $decoded['ar'] ?? ''));

            return ['en' => $english];
        }

        return ['en' => trim((string) $value)];
    }

    private function encodeLocalized(string $english, string $arabic): string
    {
        return json_encode(['en' => $english, 'ar' => $arabic], JSON_UNESCAPED_UNICODE);
    }

    private function replaceArabic(?string $value, array $arabic): string
    {
        $decoded = json_decode((string) $value, true);
        $decoded = is_array($decoded) ? $decoded : [];
        $english = isset($decoded['en']) && is_array($decoded['en']) ? $decoded['en'] : $decoded;
        $shared = array_diff_key($decoded, ['en' => true, 'ar' => true]);

        return json_encode([
            ...$shared,
            'en' => $english,
            'ar' => $arabic,
        ], JSON_UNESCAPED_UNICODE);
    }

    private function englishSection(?string $value): array
    {
        $decoded = json_decode((string) $value, true);
        if (! is_array($decoded)) {
            return [];
        }

        return isset($decoded['en']) && is_array($decoded['en']) ? $decoded['en'] : $decoded;
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
        return trim($time) === '' ? '8:00 مساءً' : str_replace(['PM', 'AM'], ['مساءً', 'صباحًا'], $time);
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
