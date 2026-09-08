<?php

namespace Tests\Feature\Api;

use Tests\TestCase;

class HealthEndpointTest extends TestCase
{
    public function test_health_endpoint_returns_ok(): void
    {
        $this->getJson('/api/v1/health')
            ->assertOk()
            ->assertJsonPath('data.status', 'ok')
            ->assertJsonPath('data.media_storage.ready', true)
            ->assertJsonPath('data.media_storage.disk', 'public');
    }
}
