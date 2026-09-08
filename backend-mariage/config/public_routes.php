<?php

use App\Models\BirthdayGreeting;
use App\Models\EidGreeting;
use App\Models\Invitation;
use App\Models\LoveMessage;

return [
    'models' => [
        Invitation::class,
        EidGreeting::class,
        BirthdayGreeting::class,
        LoveMessage::class,
    ],
];
