<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rsvp extends Model
{
    use HasFactory;

    protected $fillable = [
        'invitation_id',
        'full_name',
        'attending',
        'message',
        'locale',
        'ip_address',
        'user_agent',
    ];

    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }

    protected function casts(): array
    {
        return [
            'attending' => 'boolean',
        ];
    }
}
