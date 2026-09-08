<?php

namespace Database\Seeders;

use App\Models\Invitation;
use Illuminate\Database\Seeder;

class InvitationSeeder extends Seeder
{
    /**
     * Seed editable invitation sites for dashboard development.
     */
    public function run(): void
    {
        foreach ($this->invitations() as $invitation) {
            $slug = Invitation::makeSlug($invitation['groom_name'], $invitation['bride_name']);
            $existing = Invitation::query()
                ->where('slug', $slug)
                ->where('code', $invitation['code'])
                ->first();

            if ($existing) {
                $invitation['template'] = $existing->template;
            }

            Invitation::query()->updateOrCreate(
                [
                    'slug' => $slug,
                    'code' => $invitation['code'],
                ],
                [
                    ...$invitation,
                    'slug' => $slug,
                ]
            );
        }
    }

    private function invitations(): array
    {
        return [
            $this->invitation('2417', 'Omar', 'Salma', 'Omar & Salma', 'عمر و سلمى', 'Cleopatra Hall', 'قاعة كليوباترا', 'Friday, October 30, 2026', 'الجمعة، 30 أكتوبر 2026', true),
            $this->invitation('5820', 'Youssef', 'Laila', 'Youssef & Laila', 'يوسف و ليلى', 'Royal Garden Venue', 'قاعة الحديقة الملكية', 'Thursday, November 12, 2026', 'الخميس، 12 نوفمبر 2026', true),
            $this->invitation('9046', 'Karim', 'Nour', 'Karim & Nour', 'كريم و نور', 'Moonlight Ballroom', 'قاعة ضوء القمر', 'Saturday, December 5, 2026', 'السبت، 5 ديسمبر 2026', false),
        ];
    }

    private function invitation(
        string $code,
        string $groomName,
        string $brideName,
        string $coupleNameEn,
        string $coupleNameAr,
        string $venueEn,
        string $venueAr,
        string $dateEn,
        string $dateAr,
        bool $isPublished
    ): array {
        return [
            'code' => $code,
            'groom_name' => $groomName,
            'bride_name' => $brideName,
            'couple_display_name' => [
                'en' => $coupleNameEn,
                'ar' => $coupleNameAr,
            ],
            'is_published' => $isPublished,
            'template' => 'classic',
            'loading' => [
                'en' => [
                    'prompt_kicker' => 'The Invitation Is Ready',
                    'open_prompt' => 'Open the Invitation Letter',
                ],
                'ar' => [
                    'prompt_kicker' => 'الدعوة جاهزة',
                    'open_prompt' => 'افتح جواب الدعوة',
                ],
            ],
            'hero' => [
                'en' => [
                    'open_invitation' => 'Open wedding invitation',
                    'open' => 'Open',
                    'kicker' => 'We are getting married',
                    'body' => 'Together with their families, invite you to celebrate their wedding.',
                    'save_date' => 'Save the Date',
                    'view_details' => 'View Details',
                ],
                'ar' => [
                    'open_invitation' => 'افتح دعوة الزفاف',
                    'open' => 'افتح',
                    'kicker' => 'نحن على موعد مع الزفاف',
                    'body' => 'بمشاركة عائلتينا، ندعوكم للاحتفال معنا بزفافنا.',
                    'save_date' => 'احفظ التاريخ',
                    'view_details' => 'عرض التفاصيل',
                ],
            ],
            'event' => [
                'en' => [
                    'kicker' => 'Wedding Details',
                    'title' => 'When & Where',
                    'day_label' => 'The Wedding Day',
                    'date' => $dateEn,
                    'description' => 'We would be honored to celebrate this beautiful evening with you and our families.',
                    'time' => '8:00 PM',
                    'venue_label' => 'The Venue',
                    'venue' => $venueEn,
                    'location' => 'Qutour Center, Gharbia Governorate',
                    'address' => 'Address',
                    'landmark' => 'Nearby Landmark',
                    'landmark_value' => 'Next to the train station',
                    'open_location' => 'Open Location',
                    'map_url' => '',
                ],
                'ar' => [
                    'kicker' => 'تفاصيل الزفاف',
                    'title' => 'الموعد والمكان',
                    'day_label' => 'يوم الزفاف',
                    'date' => $dateAr,
                    'description' => 'يسعدنا ويشرفنا أن تشاركونا هذه الليلة الجميلة مع عائلتينا.',
                    'time' => '8:00 مساءً',
                    'venue_label' => 'قاعة الحفل',
                    'venue' => $venueAr,
                    'location' => 'مركز قطور، محافظة الغربية',
                    'address' => 'العنوان',
                    'landmark' => 'علامة مميزة',
                    'landmark_value' => 'بجوار محطة القطار',
                    'open_location' => 'فتح الموقع',
                    'map_url' => '',
                ],
            ],
            'countdown' => [
                'target_date' => '2026-10-30T20:00:00',
                'en' => [
                    'title' => 'Countdown',
                    'finished' => 'Today is the day!',
                ],
                'ar' => [
                    'title' => 'العد التنازلي',
                    'finished' => 'اليوم هو يوم الزفاف!',
                ],
            ],
            'love_story' => [
                'en' => [
                    'kicker' => 'The Journey',
                    'title' => 'Our Love Story',
                    'events' => [
                        ['date' => '30/1/2026', 'title' => 'First Meet', 'desc' => 'The first hello that quietly started everything.'],
                        ['date' => '13/2/2026', 'title' => 'The Engagement', 'desc' => 'The next chapter became official.'],
                    ],
                ],
                'ar' => [
                    'kicker' => 'الرحلة',
                    'title' => 'قصة حبنا',
                    'events' => [
                        ['date' => '30/1/2026', 'title' => 'أول لقاء', 'desc' => 'كانت البداية بكلمة مرحباً هادئة صنعت كل شيء.'],
                        ['date' => '13/2/2026', 'title' => 'الخطوبة', 'desc' => 'أصبح الوعد رسمياً وبدأ فصل جديد من الحكاية.'],
                    ],
                ],
            ],
            'gallery' => [
                'image_urls' => [],
                'en' => ['title' => 'Memories'],
                'ar' => ['title' => 'ذكريات'],
            ],
            'rsvp' => [
                'en' => [
                    'kicker' => 'RSVP',
                    'title' => 'Are you attending?',
                    'name' => 'Full Name',
                    'name_placeholder' => 'John Doe',
                    'attending' => 'Will you attend?',
                    'submit' => 'Send RSVP',
                    'yes' => 'Yes, I will attend',
                    'no' => "No, I can't make it",
                    'message' => 'Message (Optional)',
                    'message_placeholder' => 'Send your wishes...',
                    'thanks' => 'Thank you, {{name}}!',
                    'yes_reply' => "We can't wait to celebrate with you!",
                    'no_reply' => "We're sorry you can't make it, but you'll be in our hearts!",
                ],
                'ar' => [
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
                ],
            ],
            'footer' => [
                'en' => [
                    'date' => $dateEn,
                    'made_with' => 'Made with',
                    'for_day' => 'for our special day',
                ],
                'ar' => [
                    'date' => $dateAr,
                    'made_with' => 'صُنع بكل',
                    'for_day' => 'ليومنا المميز',
                ],
            ],
            'audio' => [
                'src' => '',
                'volume' => '0.4',
                'en' => [
                    'play' => 'Play Music',
                    'pause' => 'Pause Music',
                ],
                'ar' => [
                    'play' => 'تشغيل الموسيقى',
                    'pause' => 'إيقاف الموسيقى',
                ],
            ],
        ];
    }
}
