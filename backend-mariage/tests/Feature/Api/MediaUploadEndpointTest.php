<?php

namespace Tests\Feature\Api;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaUploadEndpointTest extends TestCase
{
    public function test_admin_can_upload_gallery_image(): void
    {
        Storage::fake('public');

        $response = $this->post('/api/v1/admin/media', [
            'type' => 'gallery',
            'file' => UploadedFile::fake()->create('memory.jpg', 512, 'image/jpeg'),
        ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonStructure(['data' => ['path', 'url']]);

        Storage::disk('public')->assertExists($response->json('data.path'));
        $this->assertStringContainsString('/storage/invitations/gallery/', $response->json('data.url'));
    }

    public function test_admin_can_upload_audio_file(): void
    {
        Storage::fake('public');

        $response = $this->post('/api/v1/admin/media', [
            'type' => 'audio',
            'file' => UploadedFile::fake()->create('song.mp3', 512, 'audio/mpeg'),
        ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonStructure(['data' => ['path', 'url']]);

        Storage::disk('public')->assertExists($response->json('data.path'));
        $this->assertStringContainsString('/storage/invitations/audio/', $response->json('data.url'));
    }

    public function test_railway_upload_is_rejected_without_a_persistent_volume(): void
    {
        $previousEnvironment = env('RAILWAY_ENVIRONMENT');
        $previousVolumePath = env('RAILWAY_VOLUME_MOUNT_PATH');
        putenv('RAILWAY_ENVIRONMENT=production');
        putenv('RAILWAY_VOLUME_MOUNT_PATH');
        $_ENV['RAILWAY_ENVIRONMENT'] = 'production';
        unset($_ENV['RAILWAY_VOLUME_MOUNT_PATH']);

        try {
            $this->post('/api/v1/admin/media', [
                'type' => 'gallery',
                'file' => UploadedFile::fake()->create('memory.jpg', 100, 'image/jpeg'),
            ], ['Accept' => 'application/json'])
                ->assertServiceUnavailable();
        } finally {
            $this->restoreEnvironment('RAILWAY_ENVIRONMENT', $previousEnvironment);
            $this->restoreEnvironment('RAILWAY_VOLUME_MOUNT_PATH', $previousVolumePath);
        }
    }

    private function restoreEnvironment(string $key, mixed $value): void
    {
        if ($value === null || $value === false) {
            putenv($key);
            unset($_ENV[$key]);

            return;
        }

        putenv("{$key}={$value}");
        $_ENV[$key] = $value;
    }
}
