<?php

namespace Tests\Feature\Api;

use App\Models\BirthdayGreeting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BirthdayGreetingMediaUrlTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_response_rewrites_stored_media_to_the_current_backend_host(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('birthday/album/photo.jpg', 'demo');

        $greeting = BirthdayGreeting::query()->create([
            'code' => '1234',
            'slug' => 'birthday-media',
            'recipient_name' => 'Nour',
            'sender_name' => 'Omar',
            'is_published' => true,
            'content' => [
                'album' => [
                    'images' => [
                        'https://old-backend.example/storage/birthday/album/photo.jpg',
                    ],
                ],
            ],
        ]);

        $this->getJson("/api/v1/birthday-greetings/{$greeting->public_path}")
            ->assertOk()
            ->assertJsonPath(
                'data.content.album.images.0',
                'http://localhost:8000/storage/birthday/album/photo.jpg'
            );
    }

    public function test_public_response_removes_missing_storage_images(): void
    {
        Storage::fake('public');

        $greeting = BirthdayGreeting::query()->create([
            'code' => '5678',
            'slug' => 'birthday-missing-media',
            'recipient_name' => 'Nour',
            'sender_name' => 'Omar',
            'is_published' => true,
            'content' => [
                'album' => [
                    'images' => [
                        'https://old-backend.example/storage/birthday/album/missing.jpg',
                    ],
                ],
            ],
        ]);

        $this->getJson("/api/v1/birthday-greetings/{$greeting->public_path}")
            ->assertOk()
            ->assertJsonPath('data.content.album.images', []);
    }
}
