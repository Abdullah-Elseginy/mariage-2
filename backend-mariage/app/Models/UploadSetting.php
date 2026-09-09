<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UploadSetting extends Model
{
    protected $fillable = [
        'guest_image_max_kb',
        'guest_max_images',
        'gallery_image_max_kb',
    ];

    protected function casts(): array
    {
        return [
            'guest_image_max_kb' => 'integer',
            'guest_max_images' => 'integer',
            'gallery_image_max_kb' => 'integer',
        ];
    }

    public static function defaults(): array
    {
        return [
            'guest_image_max_kb' => (int) config('uploads.guest_image_max_kb', 350),
            'guest_max_images' => (int) config('uploads.guest_max_images', 4),
            'gallery_image_max_kb' => (int) config('uploads.gallery_image_max_kb', 500),
        ];
    }

    public static function values(): array
    {
        $settings = static::query()->first();

        return $settings
            ? $settings->only(array_keys(static::defaults()))
            : static::defaults();
    }
}
