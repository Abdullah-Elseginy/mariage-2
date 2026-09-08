<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Support\PersistentMediaStorage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class MediaUploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        PersistentMediaStorage::ensureReady();

        $validated = $request->validate([
            'type' => ['required', 'string', Rule::in(['gallery', 'audio'])],
            'file' => [
                'required',
                'file',
                'max:20480',
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
            ],
        ], 201);
    }
}
