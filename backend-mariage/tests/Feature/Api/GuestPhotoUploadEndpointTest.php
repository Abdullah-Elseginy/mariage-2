<?php

namespace Tests\Feature\Api;

use App\Models\GuestPhoto;
use App\Models\Invitation;
use App\Models\Rsvp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GuestPhotoUploadEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_upload_photo_to_invitation(): void
    {
        Storage::fake('public');

        $invitation = Invitation::create([
            'code' => '1234',
            'slug' => 'abdullah-walaa',
            'groom_name' => 'Abdullah',
            'bride_name' => 'Walaa',
            'couple_display_name' => 'Abdullah & Walaa',
        ]);

        $file = UploadedFile::fake()->create('party_photo.jpg', 300, 'image/jpeg');

        $response = $this->postJson("/api/v1/invitations/{$invitation->public_path}/guest-photos", [
            'file' => $file,
            'guest_name' => 'John Doe',
            'uploader_id' => '12345678-1234-1234-1234-123456789012',
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.guest_name', 'John Doe');
        $this->assertNotNull($response->json('data.image_url'));

        // Assert database has record
        $this->assertDatabaseHas('guest_photos', [
            'invitation_id' => $invitation->id,
            'guest_name' => 'John Doe',
        ]);

        // Assert file exists on storage
        $guestPhoto = GuestPhoto::first();
        $storedPath = str_replace(url('/storage/'), '', $guestPhoto->image_url);
        Storage::disk('public')->assertExists(ltrim($storedPath, '/'));
    }

    public function test_photo_upload_requires_valid_image_file(): void
    {
        $invitation = Invitation::create([
            'code' => '1234',
            'slug' => 'abdullah-walaa',
            'groom_name' => 'Abdullah',
            'bride_name' => 'Walaa',
            'couple_display_name' => 'Abdullah & Walaa',
        ]);

        // Upload non-image
        $file = UploadedFile::fake()->create('document.pdf', 500, 'application/pdf');

        $this->postJson("/api/v1/invitations/{$invitation->public_path}/guest-photos", [
            'file' => $file,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);
    }

    public function test_guest_upload_size_and_per_guest_count_are_enforced(): void
    {
        Storage::fake('public');

        $invitation = Invitation::create([
            'code' => '1234',
            'slug' => 'limited-couple',
            'groom_name' => 'Limited',
            'bride_name' => 'Couple',
            'couple_display_name' => 'Limited & Couple',
            'party_upload' => ['is_enabled' => true, 'max_images' => 2],
        ]);
        $uploaderId = 'aaaaaaaa-1234-1234-1234-123456789012';

        $this->postJson("/api/v1/invitations/{$invitation->public_path}/guest-photos", [
            'file' => UploadedFile::fake()->create('too-large.jpg', 351, 'image/jpeg'),
            'uploader_id' => $uploaderId,
        ])->assertUnprocessable()->assertJsonValidationErrors('file');

        foreach (range(1, 2) as $index) {
            $this->postJson("/api/v1/invitations/{$invitation->public_path}/guest-photos", [
                'file' => UploadedFile::fake()->create("photo-{$index}.jpg", 100, 'image/jpeg'),
                'uploader_id' => $uploaderId,
            ])->assertCreated()->assertJsonPath('meta.max_images', 2);
        }

        $this->getJson("/api/v1/invitations/{$invitation->public_path}/guest-upload-status?uploader_id={$uploaderId}")
            ->assertOk()
            ->assertJsonPath('data.uploaded_count', 2)
            ->assertJsonPath('data.remaining_images', 0);

        $this->postJson("/api/v1/invitations/{$invitation->public_path}/guest-photos", [
            'file' => UploadedFile::fake()->create('extra.jpg', 100, 'image/jpeg'),
            'uploader_id' => $uploaderId,
        ])->assertUnprocessable()->assertJsonValidationErrors('file');

        $this->postJson("/api/v1/invitations/{$invitation->public_path}/guest-photos", [
            'file' => UploadedFile::fake()->create('other-guest.jpg', 100, 'image/jpeg'),
            'uploader_id' => 'bbbbbbbb-1234-1234-1234-123456789012',
        ])->assertCreated();
    }

    public function test_organizer_can_fetch_dashboard_data(): void
    {
        $invitation = Invitation::create([
            'code' => '1234',
            'slug' => 'abdullah-walaa',
            'groom_name' => 'Abdullah',
            'bride_name' => 'Walaa',
            'couple_display_name' => 'Abdullah & Walaa',
        ]);

        // Add some RSVPs
        Rsvp::create([
            'invitation_id' => $invitation->id,
            'full_name' => 'Alice RSVP',
            'attending' => true,
            'locale' => 'en',
        ]);

        // Add some Guest Photos
        GuestPhoto::create([
            'invitation_id' => $invitation->id,
            'image_url' => 'http://localhost/storage/invitations/guest_photos/dummy.jpg',
            'guest_name' => 'Bob Photo',
        ]);

        $response = $this->getJson("/api/v1/invitations/{$invitation->public_path}/organizer", [
            'X-Organizer-Username' => $invitation->organizer_username,
            'X-Organizer-Password' => $invitation->organizer_password,
        ]);

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                'invitation',
                'rsvps',
                'guest_photos',
            ],
        ]);

        $response->assertJsonCount(1, 'data.rsvps');
        $response->assertJsonCount(1, 'data.guest_photos');
        $this->assertEquals('Alice RSVP', $response->json('data.rsvps.0.full_name'));
        $this->assertEquals('Bob Photo', $response->json('data.guest_photos.0.guest_name'));
    }

    public function test_organizer_can_download_guest_photo_as_an_attachment(): void
    {
        Storage::fake('public');

        $invitation = Invitation::create([
            'code' => '1234',
            'slug' => 'download-couple',
            'groom_name' => 'Download',
            'bride_name' => 'Couple',
            'couple_display_name' => 'Download & Couple',
        ]);
        $storagePath = 'invitations/guest_photos/photo.jpg';
        Storage::disk('public')->put($storagePath, 'image-content');
        $photo = GuestPhoto::create([
            'invitation_id' => $invitation->id,
            'image_url' => url('/storage/'.$storagePath),
            'guest_name' => 'Test Guest',
        ]);
        $downloadUrl = "/api/v1/invitations/{$invitation->public_path}/guest-photos/{$photo->id}/download";

        $this->get($downloadUrl)->assertUnauthorized();

        $this->get($downloadUrl, [
            'X-Organizer-Username' => $invitation->organizer_username,
            'X-Organizer-Password' => $invitation->organizer_password,
        ])->assertOk()
            ->assertHeader('content-disposition', 'attachment; filename=photo_'.$photo->id.'_test-guest.jpg');
    }

    public function test_organizer_unauthorized_access_fails(): void
    {
        $invitation = Invitation::create([
            'code' => '1234',
            'slug' => 'abdullah-walaa',
            'groom_name' => 'Abdullah',
            'bride_name' => 'Walaa',
            'couple_display_name' => 'Abdullah & Walaa',
        ]);

        $this->getJson("/api/v1/invitations/{$invitation->public_path}/organizer")
            ->assertStatus(401);
    }
}
