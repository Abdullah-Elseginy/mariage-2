<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaUrlNormalizer
{
    public static function normalize(mixed $value, Request $request, bool $stripMissing = false): mixed
    {
        if (is_array($value)) {
            $normalized = [];

            foreach ($value as $key => $item) {
                $normalized[$key] = self::normalize($item, $request, $stripMissing);
            }

            if (array_is_list($normalized)) {
                return array_values(array_filter(
                    $normalized,
                    static fn (mixed $item) => $item !== null && $item !== ''
                ));
            }

            return $normalized;
        }

        if (! is_string($value)) {
            return $value;
        }

        $path = parse_url($value, PHP_URL_PATH);

        if (! is_string($path) || ! str_starts_with($path, '/storage/')) {
            return $value;
        }

        $storagePath = ltrim((string) substr($path, strlen('/storage/')), '/');

        if (
            $stripMissing
            && $storagePath !== ''
            && ! Storage::disk(PersistentMediaStorage::diskName())->exists($storagePath)
        ) {
            return null;
        }

        $query = parse_url($value, PHP_URL_QUERY);
        $fragment = parse_url($value, PHP_URL_FRAGMENT);

        return rtrim($request->getSchemeAndHttpHost(), '/')
            .$path
            .(is_string($query) && $query !== '' ? "?{$query}" : '')
            .(is_string($fragment) && $fragment !== '' ? "#{$fragment}" : '');
    }
}
