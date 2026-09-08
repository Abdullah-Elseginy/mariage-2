<?php

namespace Tests\Feature\Api;

use App\Models\Invitation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RsvpEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_submit_rsvp(): void
    {
        $invitation = Invitation::create([
            'code' => '1234',
            'slug' => 'abdullah-walaa',
            'groom_name' => 'Abdullah',
            'bride_name' => 'Walaa',
            'couple_display_name' => 'Abdullah & Walaa',
        ]);

        $this->postJson('/api/v1/rsvps', [
            'invitation_path' => $invitation->public_path,
            'full_name' => 'Walaa Guest',
            'attending' => true,
            'message' => 'Congratulations!',
            'locale' => 'en',
        ])
            ->assertCreated()
            ->assertJsonPath('data.full_name', 'Walaa Guest')
            ->assertJsonPath('data.attending', true);

        $this->assertDatabaseHas('rsvps', [
            'invitation_id' => $invitation->id,
            'full_name' => 'Walaa Guest',
            'attending' => true,
            'locale' => 'en',
        ]);
    }

    public function test_rsvp_requires_name_and_attendance(): void
    {
        $this->postJson('/api/v1/rsvps', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['full_name', 'attending']);
    }
}
