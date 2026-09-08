<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Support\PersistentMediaStorage;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $mediaStorage = PersistentMediaStorage::status();

        return response()->json([
            'data' => [
                'status' => $mediaStorage['ready'] ? 'ok' : 'error',
                'service' => config('app.name'),
                'timestamp' => now()->toISOString(),
                'media_storage' => $mediaStorage,
            ],
        ], $mediaStorage['ready'] ? 200 : 503);
    }
}
