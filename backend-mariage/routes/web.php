<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('storage/{path}', function (string $path) {
    $disk = \Illuminate\Support\Facades\Storage::disk(
        \App\Support\PersistentMediaStorage::diskName()
    );
    if (! $disk->exists($path)) {
        abort(404);
    }

    $file = $disk->get($path);
    $type = $disk->mimeType($path);

    return \Illuminate\Support\Facades\Response::make($file, 200, [
        'Content-Type' => $type,
        'Cache-Control' => 'public, max-age=31536000',
        'Access-Control-Allow-Origin' => '*',
    ]);
})->where('path', '.*');
