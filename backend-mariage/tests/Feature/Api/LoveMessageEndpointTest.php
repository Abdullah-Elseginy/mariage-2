<?php

namespace Tests\Feature\Api;

use App\Models\LoveMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LoveMessageEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_update_and_public_can_read_love_message(): void
    {
        $response = $this->postJson('/api/v1/admin/love-messages', [
            'recipient_name' => 'Nour',
            'sender_name' => 'Omar',
            'template' => 'happy-message',
            'content' => [
                'intro' => ['teaser' => 'Something special'],
                'reasons' => ['items' => ['Your smile']],
                'gallery' => [
                    'items' => [
                        ['image' => 'https://old-backend.example/storage/love-messages/memory.jpg'],
                    ],
                ],
            ],
        ])
            ->assertCreated()
            ->assertJsonPath('data.template', 'happy-message')
            ->assertJsonPath('data.content.reasons.items.0', 'Your smile')
            ->assertJsonPath(
                'data.content.gallery.items.0.image',
                'http://localhost:8000/storage/love-messages/memory.jpg'
            );

        $id = $response->json('data.id');
        $publicPath = $response->json('data.public_path');

        $this->putJson("/api/v1/admin/love-messages/{$id}", [
            'recipient_name' => 'Nour',
            'sender_name' => 'Omar',
            'public_path' => $publicPath,
            'content' => ['final_surprise' => ['message' => 'I Love You']],
        ])
            ->assertOk()
            ->assertJsonPath('data.content.final_surprise.message', 'I Love You');

        $this->getJson("/api/v1/love-messages/{$publicPath}")
            ->assertOk()
            ->assertJsonPath('data.public_path', $publicPath);
    }

    public function test_unpublished_love_message_is_not_public(): void
    {
        $message = LoveMessage::query()->create([
            'code' => '2468',
            'slug' => 'private-message',
            'recipient_name' => 'Nour',
            'sender_name' => 'Omar',
            'is_published' => false,
        ]);

        $this->getJson("/api/v1/love-messages/{$message->public_path}")
            ->assertForbidden()
            ->assertJsonPath('message', 'This love message is not published yet.');
    }

    public function test_public_love_message_response_removes_missing_storage_images(): void
    {
        Storage::fake('public');

        $message = LoveMessage::query()->create([
            'code' => '8642',
            'slug' => 'missing-love-media',
            'recipient_name' => 'Nour',
            'sender_name' => 'Omar',
            'is_published' => true,
            'content' => [
                'gallery' => [
                    'items' => [
                        [
                            'image' => 'https://old-backend.example/storage/love-messages/memory.jpg',
                            'title' => 'A memory',
                        ],
                    ],
                ],
                'final_surprise' => [
                    'couple_photo' => 'https://old-backend.example/storage/love-messages/final.jpg',
                ],
            ],
        ]);

        $this->getJson("/api/v1/love-messages/{$message->public_path}")
            ->assertOk()
            ->assertJsonPath('data.content.gallery.items.0.image', null)
            ->assertJsonPath('data.content.final_surprise.couple_photo', null);
    }
}
