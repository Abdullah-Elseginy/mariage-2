<?php

namespace Tests\Feature\Api;

use App\Models\Invitation;
use App\Models\Rsvp;
use App\Models\GuestPhoto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminManagementAndOrganizerDeletionTest extends TestCase
{
    use RefreshDatabase;

    private Invitation $invitation;

    protected function setUp(): void
    {
        parent::setUp();

        $this->invitation = Invitation::create([
            'code' => '1234',
            'slug' => 'test-couple',
            'groom_name' => 'Groom',
            'bride_name' => 'Bride',
            'couple_display_name' => 'Groom & Bride',
            'organizer_username' => 'testorg',
            'organizer_password' => 'orgpass123',
        ]);
    }

    public function test_organizer_login_resolves_polymorphically(): void
    {
        // 1. Test invalid credentials
        $this->getJson("/api/v1/invitations/{$this->invitation->public_path}/organizer", [
            'X-Organizer-Username' => 'wrong',
            'X-Organizer-Password' => 'credentials',
        ])->assertStatus(401);

        // 2. Test standard organizer credentials (is_admin = false)
        $response = $this->getJson("/api/v1/invitations/{$this->invitation->public_path}/organizer", [
            'X-Organizer-Username' => 'testorg',
            'X-Organizer-Password' => 'orgpass123',
        ]);
        $response->assertOk()
            ->assertJsonPath('data.is_admin', false);

        // 3. Test global admin credentials (is_admin = true)
        $response = $this->getJson("/api/v1/invitations/{$this->invitation->public_path}/organizer", [
            'X-Organizer-Username' => 'wil',
            'X-Organizer-Password' => 'wil123',
        ]);
        $response->assertOk()
            ->assertJsonPath('data.is_admin', true);
    }

    public function test_only_admins_can_delete_individual_and_bulk_rsvps(): void
    {
        $rsvp1 = Rsvp::create([
            'invitation_id' => $this->invitation->id,
            'full_name' => 'Guest One',
            'attending' => true,
        ]);
        $rsvp2 = Rsvp::create([
            'invitation_id' => $this->invitation->id,
            'full_name' => 'Guest Two',
            'attending' => false,
        ]);

        // 1. Standard organizer deletion should fail (403 Forbidden)
        $this->deleteJson("/api/v1/invitations/{$this->invitation->public_path}/rsvps/{$rsvp1->id}", [], [
            'X-Organizer-Username' => 'testorg',
            'X-Organizer-Password' => 'orgpass123',
        ])->assertStatus(403);

        $this->deleteJson("/api/v1/invitations/{$this->invitation->public_path}/rsvps", [], [
            'X-Organizer-Username' => 'testorg',
            'X-Organizer-Password' => 'orgpass123',
        ])->assertStatus(403);

        $this->assertDatabaseHas('rsvps', ['id' => $rsvp1->id]);
        $this->assertDatabaseHas('rsvps', ['id' => $rsvp2->id]);

        // 2. Admin deletion works for individual RSVP
        $this->deleteJson("/api/v1/invitations/{$this->invitation->public_path}/rsvps/{$rsvp1->id}", [], [
            'X-Organizer-Username' => 'wil',
            'X-Organizer-Password' => 'wil123',
        ])->assertOk();

        $this->assertDatabaseMissing('rsvps', ['id' => $rsvp1->id]);

        // 3. Admin deletion works for bulk delete
        $this->deleteJson("/api/v1/invitations/{$this->invitation->public_path}/rsvps", [], [
            'X-Organizer-Username' => 'wil',
            'X-Organizer-Password' => 'wil123',
        ])->assertOk();

        $this->assertDatabaseMissing('rsvps', ['id' => $rsvp2->id]);
    }

    public function test_only_admins_can_delete_individual_and_bulk_guest_photos(): void
    {
        $photo1 = GuestPhoto::create([
            'invitation_id' => $this->invitation->id,
            'image_url' => 'http://localhost/storage/photo1.jpg',
            'guest_name' => 'Guest 1',
        ]);
        $photo2 = GuestPhoto::create([
            'invitation_id' => $this->invitation->id,
            'image_url' => 'http://localhost/storage/photo2.jpg',
            'guest_name' => 'Guest 2',
        ]);

        // 1. Standard organizer deletion should fail (403 Forbidden)
        $this->deleteJson("/api/v1/invitations/{$this->invitation->public_path}/guest-photos/{$photo1->id}", [], [
            'X-Organizer-Username' => 'testorg',
            'X-Organizer-Password' => 'orgpass123',
        ])->assertStatus(403);

        $this->deleteJson("/api/v1/invitations/{$this->invitation->public_path}/guest-photos", [], [
            'X-Organizer-Username' => 'testorg',
            'X-Organizer-Password' => 'orgpass123',
        ])->assertStatus(403);

        $this->assertDatabaseHas('guest_photos', ['id' => $photo1->id]);
        $this->assertDatabaseHas('guest_photos', ['id' => $photo2->id]);

        // 2. Admin deletion works for individual GuestPhoto
        $this->deleteJson("/api/v1/invitations/{$this->invitation->public_path}/guest-photos/{$photo1->id}", [], [
            'X-Organizer-Username' => 'wil',
            'X-Organizer-Password' => 'wil123',
        ])->assertOk();

        $this->assertDatabaseMissing('guest_photos', ['id' => $photo1->id]);

        // 3. Admin deletion works for bulk delete
        $this->deleteJson("/api/v1/invitations/{$this->invitation->public_path}/guest-photos", [], [
            'X-Organizer-Username' => 'wil',
            'X-Organizer-Password' => 'wil123',
        ])->assertOk();

        $this->assertDatabaseMissing('guest_photos', ['id' => $photo2->id]);
    }

    public function test_admin_accounts_crud_and_guards(): void
    {
        // 1. List admins
        $response = $this->getJson('/api/v1/admin/admins');
        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.username', 'wil');

        // 2. Create admin
        $createResponse = $this->postJson('/api/v1/admin/admins', [
            'username' => 'another-admin',
            'password' => 'secret123',
        ]);
        $createResponse->assertCreated()
            ->assertJsonPath('data.username', 'another-admin');

        $this->assertDatabaseHas('admins', [
            'username' => 'another-admin',
        ]);

        $newAdminId = $createResponse->json('data.id');

        // Check list contains 2 admins now
        $this->getJson('/api/v1/admin/admins')
            ->assertJsonCount(2, 'data');

        // 3. Prevent deleting 'wil'
        $wilId = DB::table('admins')->where('username', 'wil')->value('id');
        $this->deleteJson("/api/v1/admin/admins/{$wilId}")
            ->assertStatus(422)
            ->assertJsonPath('message', 'Cannot delete the main admin account (wil).');

        // 4. Delete the new admin
        $this->deleteJson("/api/v1/admin/admins/{$newAdminId}")
            ->assertStatus(204);

        $this->assertDatabaseMissing('admins', [
            'id' => $newAdminId,
        ]);

        // 5. Prevent deleting the only remaining admin
        $this->deleteJson("/api/v1/admin/admins/{$wilId}")
            ->assertStatus(422);
    }
}
