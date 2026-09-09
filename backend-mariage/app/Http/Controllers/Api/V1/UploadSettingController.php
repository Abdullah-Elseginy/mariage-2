<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\UploadSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UploadSettingController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(['data' => UploadSetting::values()]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'guest_image_max_kb' => ['required', 'integer', 'min:50', 'max:20480'],
            'guest_max_images' => ['required', 'integer', 'min:1', 'max:100'],
            'gallery_image_max_kb' => ['required', 'integer', 'min:50', 'max:20480'],
        ]);

        $settings = UploadSetting::query()->first();
        if ($settings) {
            $settings->update($validated);
        } else {
            $settings = UploadSetting::query()->create($validated);
        }

        return response()->json(['data' => $settings->fresh()->only(array_keys(UploadSetting::defaults()))]);
    }
}
