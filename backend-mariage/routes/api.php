<?php

use App\Http\Controllers\Api\V1\BirthdayGreetingController;
use App\Http\Controllers\Api\V1\EidGreetingController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\InvitationController;
use App\Http\Controllers\Api\V1\LoveMessageController;
use App\Http\Controllers\Api\V1\MediaUploadController;
use App\Http\Controllers\Api\V1\PortfolioDemoController;
use App\Http\Controllers\Api\V1\RsvpController;
use App\Http\Controllers\Api\V1\UploadSettingController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function (): void {
    Route::get('health', HealthController::class)->name('health');
    Route::get('portfolio-demos', [PortfolioDemoController::class, 'index'])->name('portfolio-demos.index');
    Route::get('invitations/{publicPath}', [InvitationController::class, 'publicShow'])->name('invitations.public-show');
    Route::get('invitations/{publicPath}/organizer', [InvitationController::class, 'organizerShow'])->name('invitations.organizer-show');
    Route::delete('invitations/{publicPath}/rsvps', [InvitationController::class, 'deleteAllRsvps'])->name('invitations.delete-all-rsvps');
    Route::delete('invitations/{publicPath}/rsvps/{id}', [InvitationController::class, 'deleteRsvp'])->name('invitations.delete-rsvp');
    Route::delete('invitations/{publicPath}/guest-photos', [InvitationController::class, 'deleteAllGuestPhotos'])->name('invitations.delete-all-guest-photos');
    Route::delete('invitations/{publicPath}/guest-photos/{id}', [InvitationController::class, 'deleteGuestPhoto'])->name('invitations.delete-guest-photo');
    Route::get('invitations/{publicPath}/guest-photos/{id}/download', [InvitationController::class, 'downloadGuestPhoto'])->whereNumber('id')->name('invitations.download-guest-photo');
    Route::post('invitations/{publicPath}/guest-photos', [InvitationController::class, 'storeGuestPhoto'])->name('invitations.store-guest-photo');
    Route::get('invitations/{publicPath}/guest-upload-status', [InvitationController::class, 'guestUploadStatus'])->name('invitations.guest-upload-status');
    Route::get('eid-greetings/{publicPath}', [EidGreetingController::class, 'publicShow'])->name('eid-greetings.public-show');
    Route::get('birthday-greetings/{publicPath}', [BirthdayGreetingController::class, 'publicShow'])->name('birthday-greetings.public-show');
    Route::get('love-messages/{publicPath}', [LoveMessageController::class, 'publicShow'])->name('love-messages.public-show');
    Route::post('rsvps', [RsvpController::class, 'store'])->name('rsvps.store');
    Route::get('upload-settings', [UploadSettingController::class, 'show'])->name('upload-settings.show');

    Route::prefix('admin')->name('admin.')->group(function (): void {
        Route::post('media', [MediaUploadController::class, 'store'])->name('media.store');
        Route::put('upload-settings', [UploadSettingController::class, 'update'])->name('upload-settings.update');
        Route::apiResource('invitations', InvitationController::class)->except(['create', 'edit']);
        Route::apiResource('eid-greetings', EidGreetingController::class)->except(['create', 'edit']);
        Route::apiResource('birthday-greetings', BirthdayGreetingController::class)->except(['create', 'edit']);
        Route::apiResource('love-messages', LoveMessageController::class)->except(['create', 'edit']);
        Route::get('admins', [InvitationController::class, 'listAdmins'])->name('admins.index');
        Route::post('admins', [InvitationController::class, 'createAdmin'])->name('admins.store');
        Route::delete('admins/{id}', [InvitationController::class, 'deleteAdmin'])->name('admins.destroy');
    });
});
