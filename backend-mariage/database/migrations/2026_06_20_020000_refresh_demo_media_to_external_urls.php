<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $birthdayDemoImages = [
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200',
    ];

    private array $loveDemoImages = [
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200',
    ];

    public function up(): void
    {
        DB::table('birthday_greetings')
            ->where(function ($query): void {
                $query->where('slug', 'like', 'demo%');
                if (Schema::hasColumn('birthday_greetings', 'is_demo')) {
                    $query->orWhere('is_demo', true);
                }
            })
            ->orderBy('id')
            ->get(['id', 'content'])
            ->each(function (object $row): void {
                $content = $this->decodeContent($row->content);
                $content['album'] = array_merge($content['album'] ?? [], [
                    'images' => $this->birthdayDemoImages,
                    'images_text' => implode("\n", $this->birthdayDemoImages),
                ]);

                DB::table('birthday_greetings')
                    ->where('id', $row->id)
                    ->update([
                        'content' => json_encode($content, JSON_UNESCAPED_UNICODE),
                        'updated_at' => now(),
                    ]);
            });

        DB::table('love_messages')
            ->where(function ($query): void {
                $query->where('slug', 'like', 'demo%');
                if (Schema::hasColumn('love_messages', 'is_demo')) {
                    $query->orWhere('is_demo', true);
                }
            })
            ->orderBy('id')
            ->get(['id', 'content'])
            ->each(function (object $row): void {
                $content = $this->decodeContent($row->content);
                $existingItems = $content['gallery']['items'] ?? [];
                $galleryItems = array_map(
                    fn (string $url, int $index) => [
                        'image' => $url,
                        'title' => $existingItems[$index]['title'] ?? null,
                        'description' => $existingItems[$index]['description'] ?? null,
                        'date' => $existingItems[$index]['date'] ?? null,
                    ],
                    $this->loveDemoImages,
                    array_keys($this->loveDemoImages)
                );

                $content['gallery'] = array_merge($content['gallery'] ?? [], [
                    'items' => $galleryItems,
                    'items_text' => implode("\n", array_map(
                        fn (array $item) => implode(' | ', [
                            $item['image'] ?? '',
                            $item['title'] ?? '',
                            $item['description'] ?? '',
                            $item['date'] ?? '',
                        ]),
                        $galleryItems
                    )),
                ]);

                $content['final_surprise'] = array_merge($content['final_surprise'] ?? [], [
                    'couple_photo' => $this->loveDemoImages[0],
                ]);

                DB::table('love_messages')
                    ->where('id', $row->id)
                    ->update([
                        'content' => json_encode($content, JSON_UNESCAPED_UNICODE),
                        'updated_at' => now(),
                    ]);
            });
    }

    public function down(): void
    {
    }

    private function decodeContent(mixed $content): array
    {
        if (is_array($content)) {
            return $content;
        }

        if (! is_string($content) || $content === '') {
            return [];
        }

        $decoded = json_decode($content, true);

        return is_array($decoded) ? $decoded : [];
    }
};
