<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('birthday_greetings', 'is_demo')) {
            Schema::table('birthday_greetings', function (Blueprint $table): void {
                $table->boolean('is_demo')->default(false)->after('is_published')->index();
            });
        }

        if (! Schema::hasColumn('love_messages', 'is_demo')) {
            Schema::table('love_messages', function (Blueprint $table): void {
                $table->boolean('is_demo')->default(false)->after('is_published')->index();
            });
        }

        DB::table('birthday_greetings')->updateOrInsert(
            ['slug' => 'demo-love-velvet', 'code' => '0009'],
            [
                'recipient_name' => 'Laila',
                'sender_name' => 'Omar',
                'is_published' => true,
                'is_demo' => true,
                'locale' => 'en',
                'font_family' => 'romantic',
                'template' => 'romantic',
                'content' => json_encode($this->birthdayContent(), JSON_UNESCAPED_UNICODE),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('love_messages')->updateOrInsert(
            ['slug' => 'demo-happy-message', 'code' => '0011'],
            [
                'recipient_name' => 'My Love',
                'sender_name' => 'Someone Special',
                'is_published' => true,
                'is_demo' => true,
                'locale' => 'en',
                'font_family' => 'romantic',
                'template' => 'happy-message',
                'content' => json_encode($this->loveMessageContent(), JSON_UNESCAPED_UNICODE),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    public function down(): void
    {
        DB::table('birthday_greetings')
            ->where('slug', 'demo-love-velvet')
            ->where('code', '0009')
            ->delete();

        DB::table('love_messages')
            ->where('slug', 'demo-happy-message')
            ->where('code', '0011')
            ->delete();

        if (Schema::hasColumn('birthday_greetings', 'is_demo')) {
            Schema::table('birthday_greetings', fn (Blueprint $table) => $table->dropColumn('is_demo'));
        }

        if (Schema::hasColumn('love_messages', 'is_demo')) {
            Schema::table('love_messages', fn (Blueprint $table) => $table->dropColumn('is_demo'));
        }
    }

    private function birthdayContent(): array
    {
        return [
            'basic' => ['passcode' => '140226'],
            'hero' => [
                'kicker' => 'Celebrating the one who makes every day beautiful',
                'quote' => '"You turn ordinary moments into memories I never want to lose."',
                'birthdate' => '14 • 02 • 2027',
                'banner_image' => '',
                'avatar_image' => '',
                'avatar_title' => 'My Love',
                'avatar_subtitle' => 'The most beautiful part of every day',
            ],
            'countdown' => [
                'target_date' => '2027-02-14T00:00:00+02:00',
                'title' => 'COUNTDOWN TO YOUR SPECIAL DAY',
                'pending_text' => 'Every second brings us closer to celebrating you.',
                'completed_title' => 'Happy Birthday, My Love!',
                'completed_text' => 'Today belongs to your smile and every beautiful dream in your heart.',
            ],
            'wishes' => [
                'title' => 'WISHES WRITTEN WITH LOVE',
                'items' => [
                    ['text' => 'May this year hold every happiness your heart deserves.', 'tags' => ['Always You', 'Forever Love']],
                    ['text' => 'Thank you for making life warmer, brighter, and more meaningful.', 'tags' => ['My Favorite Person']],
                ],
            ],
            'album' => [
                'title' => 'OUR BEAUTIFUL MEMORIES',
                'description' => 'A few moments that still make my heart smile.',
                'images' => [],
            ],
            'letter' => [
                'title' => 'A LETTER JUST FOR YOU',
                'description' => 'Open the seal to read something from my heart.',
                'letter_title' => 'On Your Beautiful Birthday',
                'letter_content' => 'You are the calm in my busiest days and the joy hidden inside every ordinary moment. I hope this new year gives you as much happiness as you give everyone around you.',
                'love_phrase' => 'With all my love',
            ],
            'audio' => ['url' => ''],
            'footer' => ['text' => 'A birthday gift made with love.'],
        ];
    }

    private function loveMessageContent(): array
    {
        return [
            'intro' => [
                'teaser' => 'Someone left something special for you...',
                'revealed_message' => 'You have received a secret message',
                'open_button' => 'Open My Message',
            ],
            'countdown_reveal' => [
                'lines' => [
                    'I have something to tell you',
                    'Something I wanted to say for a long time',
                    'You make my days brighter',
                    'You make me smile',
                    'You make life beautiful',
                    'You are special',
                    'Very special',
                    'More than you know',
                    'Almost there',
                    'Love',
                ],
            ],
            'reasons' => [
                'title' => 'Why do I love you?',
                'items' => [
                    'Because your smile changes everything.',
                    'Because talking to you feels like home.',
                    'Because you make ordinary moments magical.',
                    'Because you are simply you.',
                ],
            ],
            'gallery' => ['title' => 'Our Memories', 'items' => []],
            'letter' => [
                'title' => 'A Letter for You',
                'message' => 'My love, you have become the beautiful detail that makes every ordinary day worth remembering. Thank you for every conversation, every laugh, and every memory we continue to create together.',
                'signature' => 'Forever yours',
            ],
            'secret_boxes' => [
                'items' => [
                    ['title' => 'The first time I saw you', 'content' => 'That moment quietly became the beginning of something unforgettable.'],
                    ['title' => 'My favorite thing about you', 'content' => 'The warmth you bring into every room and every conversation.'],
                    ['title' => 'Our future', 'content' => 'More laughter, more memories, and a lifetime of choosing each other.'],
                    ['title' => 'My heart', 'content' => 'It feels at home whenever it is close to you.'],
                ],
            ],
            'love_timer' => [
                'title' => 'We have been making memories together for',
                'start_date' => '2024-02-14T00:00:00',
            ],
            'final_surprise' => [
                'prompt' => 'One last thing...',
                'message' => 'I Love You',
                'subtitle' => 'You are my favorite chapter.',
                'couple_photo' => '',
            ],
            'audio' => ['url' => ''],
        ];
    }
};
