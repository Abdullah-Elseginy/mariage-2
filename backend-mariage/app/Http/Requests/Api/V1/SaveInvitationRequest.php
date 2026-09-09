<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class SaveInvitationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'groom_name' => ['required'],
            'groom_name.en' => ['nullable', 'string', 'max:120'],
            'groom_name.ar' => ['nullable', 'string', 'max:120'],
            'bride_name' => ['required'],
            'bride_name.en' => ['nullable', 'string', 'max:120'],
            'bride_name.ar' => ['nullable', 'string', 'max:120'],
            'public_path' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*-\d{4}$/'],
            'couple_display_name' => ['nullable'],
            'couple_display_name.en' => ['nullable', 'string', 'max:180'],
            'couple_display_name.ar' => ['nullable', 'string', 'max:180'],
            'is_published' => ['sometimes', 'boolean'],
            'template' => ['sometimes', 'string', 'in:classic,signature,royal,love-letter,floral-butterfly,modern-minimal'],
            'locale' => ['sometimes', 'string', 'in:en,ar'],
            'font_family' => ['sometimes', 'string', 'in:elegant,romantic,modern,classic,playful,cheerful,sunny,bloom'],
            'hero' => ['nullable', 'array'],
            'loading' => ['nullable', 'array'],
            'event' => ['nullable', 'array'],
            'love_story' => ['nullable', 'array'],
            'gallery' => ['nullable', 'array'],
            'countdown' => ['nullable', 'array'],
            'rsvp' => ['nullable', 'array'],
            'footer' => ['nullable', 'array'],
            'audio' => ['nullable', 'array'],
            'party_upload' => ['nullable', 'array'],
            'party_upload.max_images' => ['nullable', 'integer', 'min:1', 'max:100'],
            'organizer_username' => ['nullable', 'string', 'max:255'],
            'organizer_password' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'public_path.regex' => 'The invitation route must use words separated by dashes and end with four digits.',
        ];
    }
}
