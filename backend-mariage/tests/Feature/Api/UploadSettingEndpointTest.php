<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UploadSettingEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_defaults_are_public_and_dashboard_can_update_them(): void
    {
        $this->getJson('/api/v1/upload-settings')
            ->assertOk()
            ->assertJsonPath('data.guest_image_max_kb', 350)
            ->assertJsonPath('data.guest_max_images', 4)
            ->assertJsonPath('data.gallery_image_max_kb', 500);

        $this->putJson('/api/v1/admin/upload-settings', [
            'guest_image_max_kb' => 300,
            'guest_max_images' => 6,
            'gallery_image_max_kb' => 450,
        ])->assertOk()
            ->assertJsonPath('data.guest_image_max_kb', 300)
            ->assertJsonPath('data.guest_max_images', 6)
            ->assertJsonPath('data.gallery_image_max_kb', 450);

        $this->getJson('/api/v1/upload-settings')
            ->assertJsonPath('data.guest_max_images', 6);
    }
}
