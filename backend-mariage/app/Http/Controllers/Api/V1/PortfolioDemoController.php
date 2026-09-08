<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PortfolioDemoController extends Controller
{
    /**
     * The dashboard's published demo records are the public source of truth.
     * No private customer records are returned from this endpoint.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'invitations' => $this->demosFor('invitations', 'invitation'),
                'birthdays' => $this->demosFor('birthday_greetings', 'birthday'),
                'eid' => $this->demosFor('eid_greetings', 'eid'),
                'love' => $this->demosFor('love_messages', 'love'),
            ],
        ]);
    }

    private function demosFor(string $table, string $category): array
    {
        if (! Schema::hasTable($table)) {
            return [];
        }

        $query = DB::table($table)->where('is_published', true);
        $query->where(function ($demos) use ($table): void {
            $demos->where('slug', 'like', 'demo%');

            if (Schema::hasColumn($table, 'is_demo')) {
                $demos->orWhere('is_demo', true);
            }
        });

        $columns = ['slug', 'code'];
        if (Schema::hasColumn($table, 'template')) {
            $columns[] = 'template';
            $query->orderBy('template');
        }

        return $query
            ->orderBy('id')
            ->get($columns)
            ->map(fn (object $demo) => [
                'category' => $category,
                'template' => $demo->template ?? 'default',
                'path' => "{$demo->slug}-{$demo->code}",
            ])
            ->values()
            ->all();
    }
}
