<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class PersistentMediaStorage
{
    public static function diskName(): string
    {
        return (string) config('filesystems.media_disk', 'public');
    }

    public static function status(): array
    {
        $diskName = self::diskName();
        $diskConfig = config("filesystems.disks.{$diskName}", []);
        $driver = $diskConfig['driver'] ?? null;
        $root = $diskConfig['root'] ?? null;
        $railway = filled(env('RAILWAY_ENVIRONMENT')) || filled(env('RAILWAY_PROJECT_ID'));
        $volumePath = env('RAILWAY_VOLUME_MOUNT_PATH');
        $usesPersistentDriver = $driver !== 'local';
        $mountedAtMediaRoot = $usesPersistentDriver || (
            is_string($root)
            && is_string($volumePath)
            && self::normalizePath($root) === self::normalizePath($volumePath)
        );
        $ready = ! $railway || $mountedAtMediaRoot;

        return [
            'ready' => $ready,
            'disk' => $diskName,
            'driver' => $driver,
            'root' => $root,
            'railway_volume_attached' => filled($volumePath),
            'railway_volume_path' => $volumePath,
            'message' => $ready
                ? 'Media storage is configured.'
                : 'Attach a Railway Volume at the configured media storage root before accepting uploads.',
        ];
    }

    public static function ensureReady(): void
    {
        $status = self::status();

        abort_unless($status['ready'], 503, $status['message']);
    }

    public static function url(string $path): string
    {
        $url = Storage::disk(self::diskName())->url($path);

        return str_starts_with($url, '/')
            ? url($url)
            : $url;
    }

    private static function normalizePath(string $path): string
    {
        return rtrim(str_replace('\\', '/', $path), '/');
    }
}
