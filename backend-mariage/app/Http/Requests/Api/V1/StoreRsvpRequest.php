<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreRsvpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invitation_path' => ['nullable', 'string', 'max:180'],
            'full_name' => ['required', 'string', 'max:120'],
            'attending' => ['required', 'boolean'],
            'message' => ['nullable', 'string', 'max:1000'],
            'locale' => ['nullable', 'string', 'in:en,ar'],
        ];
    }

    public function attributes(): array
    {
        return [
            'full_name' => 'full name',
        ];
    }
}
