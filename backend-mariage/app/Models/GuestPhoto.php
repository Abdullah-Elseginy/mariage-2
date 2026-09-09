<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuestPhoto extends Model
{
    protected $hidden = [
        'uploader_key',
    ];

    protected $fillable = [
        'invitation_id',
        'image_url',
        'guest_name',
        'uploader_key',
    ];

    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }
}
