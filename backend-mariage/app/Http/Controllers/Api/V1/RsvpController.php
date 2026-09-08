<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreRsvpRequest;
use App\Http\Resources\RsvpResource;
use App\Models\Invitation;
use App\Models\Rsvp;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;

class RsvpController extends Controller
{
    public function store(StoreRsvpRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $invitation = $this->findInvitation($validated['invitation_path'] ?? null);

        $rsvp = Rsvp::create([
            ...Arr::except($validated, ['invitation_path']),
            'invitation_id' => $invitation?->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return (new RsvpResource($rsvp))
            ->response()
            ->setStatusCode(201);
    }

    private function findInvitation(?string $publicPath): ?Invitation
    {
        if (! $publicPath || ! preg_match('/^(.*)-(\d{4})$/', $publicPath, $matches)) {
            return null;
        }

        return Invitation::query()
            ->where('slug', $matches[1])
            ->where('code', $matches[2])
            ->first();
    }
}
