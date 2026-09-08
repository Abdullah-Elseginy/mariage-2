<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;

class PublicRouteUniqueness
{
    public function exists(string $slug, string $code, ?Model $except = null): bool
    {
        foreach (config('public_routes.models', []) as $modelClass) {
            if (! is_a($modelClass, Model::class, true)) {
                continue;
            }

            $query = $modelClass::query()
                ->where('slug', $slug)
                ->where('code', $code);

            if ($except && $except instanceof $modelClass) {
                $query->whereKeyNot($except->getKey());
            }

            if ($query->exists()) {
                return true;
            }
        }

        return false;
    }
}
