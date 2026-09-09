<?php

return [
    'guest_image_max_kb' => (int) env('GUEST_IMAGE_MAX_KB', 350),
    'guest_max_images' => (int) env('GUEST_MAX_IMAGES', 4),
    'gallery_image_max_kb' => (int) env('GALLERY_IMAGE_MAX_KB', 500),
];
