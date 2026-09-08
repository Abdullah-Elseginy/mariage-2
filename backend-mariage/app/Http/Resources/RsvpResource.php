<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RsvpResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'attending' => $this->attending,
            'message' => $this->message,
            'locale' => $this->locale,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
