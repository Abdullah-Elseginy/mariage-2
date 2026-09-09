<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\UploadSetting;
use App\Support\PersistentMediaStorage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MediaUploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        PersistentMediaStorage::ensureReady();

        $type = $request->input('type');
        $settings = UploadSetting::values();
        $maxFileKb = $type === 'gallery'
            ? $settings['gallery_image_max_kb']
            : 20480;

        $validated = $request->validate([
            'type' => ['required', 'string', Rule::in(['gallery', 'audio'])],
            'file' => [
                'required',
                'file',
                'max:'.$maxFileKb,
                Rule::when(
                    $request->input('type') === 'audio',
                    ['mimes:mp3,wav,ogg,m4a,mp4,aac'],
                    ['mimes:jpg,jpeg,png,webp,gif']
                ),
            ],
        ]);

        $directory = $validated['type'] === 'audio'
            ? 'invitations/audio'
            : 'invitations/gallery';

        $path = $request->file('file')->store($directory, PersistentMediaStorage::diskName());

        return response()->json([
            'data' => [
                'path' => $path,
                'url' => PersistentMediaStorage::url($path),
                'size_kb' => (int) ceil($request->file('file')->getSize() / 1024),
            ],
        ], 201);
    }
}
