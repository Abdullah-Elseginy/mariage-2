<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EidGreetingEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_and_public_can_read_eid_greeting(): void
    {
        $response = $this->postJson('/api/v1/admin/eid-greetings', [
            'recipient_name' => 'Noor',
            'sender_name' => 'Mawada',
            'content' => [
                'hero' => ['title' => 'Eid Mubarak'],
            ],
        ])
            ->assertCreated()
            ->assertJsonPath('data.recipient_name', 'Noor')
            ->assertJsonPath('data.content.hero.title', 'Eid Mubarak');

        $publicPath = $response->json('data.public_path');

        $this->getJson("/api/v1/eid-greetings/{$publicPath}")
            ->assertOk()
            ->assertJsonPath('data.public_path', $publicPath);
    }

    public function test_unpublished_eid_greeting_returns_public_message(): void
    {
        $greeting = \App\Models\EidGreeting::query()->create([
            'code' => '2468',
            'slug' => 'draft-eid',
            'recipient_name' => 'Draft',
            'sender_name' => 'Sender',
            'is_published' => false,
        ]);

        $this->getJson("/api/v1/eid-greetings/{$greeting->public_path}")
            ->assertForbidden()
            ->assertJsonPath('message', 'This Eid greeting site is not published yet.');
    }

    public function test_eid_public_path_must_be_globally_unique(): void
    {
        \App\Models\Invitation::query()->create([
            'code' => '4321',
            'slug' => 'shared-route',
            'groom_name' => 'Abdullah',
            'bride_name' => 'Walaa',
            'couple_display_name' => 'Abdullah & Walaa',
        ]);

        $this->postJson('/api/v1/admin/eid-greetings', [
            'recipient_name' => 'Noor',
            'sender_name' => 'Mawada',
            'public_path' => 'shared-route-4321',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('public_path')
            ->assertJsonPath('errors.public_path.0', 'This route exists before. Choose another route.');
    }
}
