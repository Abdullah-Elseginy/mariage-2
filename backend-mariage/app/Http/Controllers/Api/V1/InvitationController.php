<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\SaveInvitationRequest;
use App\Http\Resources\InvitationResource;
use App\Models\Invitation;
use App\Support\PersistentMediaStorage;
use App\Support\PublicRouteUniqueness;
use App\Models\GuestPhoto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;

class InvitationController extends Controller
{
    public function __construct(private readonly PublicRouteUniqueness $publicRoutes)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $columns = Schema::getColumnListing('invitations');
        $select = array_values(array_intersect($columns, [
            'id',
            'code',
            'slug',
            'groom_name',
            'bride_name',
            'couple_display_name',
            'is_published',
            'template',
            'locale',
            'font_family',
            'organizer_username',
            'organizer_password',
            'created_at',
            'updated_at',
        ]));

        $orderColumn = in_array('created_at', $columns, true) ? 'created_at' : 'id';
        
        $query = DB::table('invitations');

        if ($request->filled('search')) {
            $search = '%' . $request->input('search') . '%';
            $query->where(function ($q) use ($search) {
                $q->where('groom_name', 'like', $search)
                  ->orWhere('bride_name', 'like', $search)
                  ->orWhere('couple_display_name', 'like', $search)
                  ->orWhere('slug', 'like', $search)
                  ->orWhere('code', 'like', $search);
            });
        }

        if ($request->filled('template')) {
            $query->where('template', $request->input('template'));
        }

        if ($request->filled('is_demo')) {
            $isDemo = $request->boolean('is_demo');
            if ($isDemo) {
                $query->where(function ($q) {
                    $q->where('is_demo', true)
                      ->orWhere('slug', 'like', 'demo%');
                });
            } else {
                $query->where('is_demo', false)
                      ->where('slug', 'not like', 'demo%');
            }
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->input('date'));
        }

        $sort = $request->input('sort', 'latest');
        if ($sort === 'oldest') {
            $query->orderBy($orderColumn, 'asc');
        } else {
            $query->orderByDesc($orderColumn);
        }

        $paginator = $query->select('id')->paginate(20);

        $ids = $paginator->getCollection()->pluck('id')->all();
        $rows = empty($ids)
            ? collect()
            : DB::table('invitations')
                ->select($select)
                ->whereIn('id', $ids)
                ->get()
                ->keyBy('id');

        $rsvpCounts = collect();
        if (! empty($ids) && Schema::hasTable('rsvps') && Schema::hasColumn('rsvps', 'invitation_id')) {
            $rsvpCounts = DB::table('rsvps')
                ->select('invitation_id', DB::raw('count(*) as total'))
                ->whereIn('invitation_id', $ids)
                ->groupBy('invitation_id')
                ->pluck('total', 'invitation_id');
        }

        $paginator->setCollection(
            collect($ids)
                ->map(function ($id) use ($rows, $rsvpCounts) {
                    $row = (array) $rows->get($id, []);
                    $row['rsvps_count'] = (int) ($rsvpCounts[$id] ?? 0);

                    return $this->invitationListItem($row);
                })
        );

        return response()->json([
            'data' => $paginator->items(),
            'links' => [
                'first' => $paginator->url(1),
                'last' => $paginator->url($paginator->lastPage()),
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
            ],
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'from' => $paginator->firstItem(),
                'last_page' => $paginator->lastPage(),
                'path' => $paginator->path(),
                'per_page' => $paginator->perPage(),
                'to' => $paginator->lastItem(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    private function invitationListItem(array $invitation): array
    {
        $slug = $invitation['slug'] ?? '';
        $code = $invitation['code'] ?? '';

        return [
            'id' => $invitation['id'] ?? null,
            'code' => $code,
            'slug' => $slug,
            'public_path' => $slug !== '' && $code !== '' ? "{$slug}-{$code}" : '',
            'groom_name' => $this->decodeMaybeJson($invitation['groom_name'] ?? ''),
            'bride_name' => $this->decodeMaybeJson($invitation['bride_name'] ?? ''),
            'couple_display_name' => $this->decodeMaybeJson($invitation['couple_display_name'] ?? ''),
            'is_published' => (bool) ($invitation['is_published'] ?? false),
            'template' => $invitation['template'] ?? 'classic',
            'locale' => $invitation['locale'] ?? 'en',
            'font_family' => $invitation['font_family'] ?? 'elegant',
            'rsvps_count' => (int) ($invitation['rsvps_count'] ?? 0),
            'organizer_username' => $invitation['organizer_username'] ?? null,
            'organizer_password' => $invitation['organizer_password'] ?? null,
            'created_at' => isset($invitation['created_at']) ? (string) $invitation['created_at'] : null,
            'updated_at' => isset($invitation['updated_at']) ? (string) $invitation['updated_at'] : null,
        ];
    }

    private function decodeMaybeJson(mixed $value, mixed $fallback = null): mixed
    {
        if (! is_string($value)) {
            return $value ?? $fallback;
        }

        $decoded = json_decode($value, true);

        return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
    }

    public function store(SaveInvitationRequest $request): JsonResponse
    {
        $invitation = Invitation::create($this->payload($request));

        return (new InvitationResource($invitation->loadCount('rsvps')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Invitation $invitation): InvitationResource
    {
        if (Schema::hasTable('rsvps') && Schema::hasColumn('rsvps', 'invitation_id')) {
            $invitation->loadCount('rsvps');
        }

        return new InvitationResource($invitation);
    }

    public function update(SaveInvitationRequest $request, Invitation $invitation): InvitationResource
    {
        $invitation->update($this->payload($request, $invitation));

        return new InvitationResource($invitation->refresh()->loadCount('rsvps'));
    }

    public function destroy(Invitation $invitation): JsonResponse
    {
        $invitation->delete();

        return response()->json(status: 204);
    }

    public function publicShow(string $publicPath): InvitationResource
    {
        [$slug, $code] = $this->splitPublicPath($publicPath);

        $invitation = Invitation::query()
            ->where('slug', $slug)
            ->where('code', $code)
            ->first();

        if (! $invitation) {
            abort(404, 'Invitation link is invalid or no longer available.');
        }

        if (! $invitation->is_published) {
            abort(403, 'This invitation site is not published yet.');
        }

        return new InvitationResource($invitation);
    }

    public function organizerShow(Request $request, string $publicPath): JsonResponse
    {
        [$slug, $code] = $this->splitPublicPath($publicPath);

        $invitation = Invitation::query()
            ->where('slug', $slug)
            ->where('code', $code)
            ->first();

        if (! $invitation) {
            abort(404, 'Invitation link is invalid or no longer available.');
        }

        $username = $request->header('X-Organizer-Username');
        $password = $request->header('X-Organizer-Password');

        $isAdmin = false;

        // 1. Check if it's a global admin
        if (!empty($username) && !empty($password)) {
            $admin = \Illuminate\Support\Facades\DB::table('admins')
                ->where('username', $username)
                ->first();
                
            if ($admin && \Illuminate\Support\Facades\Hash::check($password, $admin->password)) {
                $isAdmin = true;
            }
        }

        // 2. If not admin, check organizer credentials
        if (!$isAdmin) {
            if (empty($invitation->organizer_username) || empty($invitation->organizer_password) ||
                $username !== $invitation->organizer_username || $password !== $invitation->organizer_password) {
                return response()->json(['message' => 'Invalid or missing organizer credentials.'], 401);
            }
        }

        return response()->json([
            'data' => [
                'invitation' => new InvitationResource($invitation),
                'rsvps' => $invitation->rsvps()->latest()->get(),
                'guest_photos' => $invitation->guestPhotos()->latest()->get(),
                'is_admin' => $isAdmin,
            ]
        ]);
    }

    public function storeGuestPhoto(Request $request, string $publicPath): JsonResponse
    {
        [$slug, $code] = $this->splitPublicPath($publicPath);

        $invitation = Invitation::query()
            ->where('slug', $slug)
            ->where('code', $code)
            ->first();

        if (! $invitation) {
            abort(404, 'Invitation link is invalid or no longer available.');
        }

        $validated = $request->validate([
            'file' => ['required', 'file', 'image', 'max:20480'],
            'guest_name' => ['nullable', 'string', 'max:120'],
        ]);

        PersistentMediaStorage::ensureReady();
        $path = $request->file('file')->store(
            'invitations/guest_photos',
            PersistentMediaStorage::diskName()
        );

        $guestPhoto = GuestPhoto::create([
            'invitation_id' => $invitation->id,
            'image_url' => PersistentMediaStorage::url($path),
            'guest_name' => $validated['guest_name'] ?? null,
        ]);

        return response()->json([
            'data' => $guestPhoto
        ], 201);
    }

    private function payload(SaveInvitationRequest $request, ?Invitation $invitation = null): array
    {
        $validated = $request->validated();
        $groomNames = $this->normalizeLocalizedName($validated['groom_name']);
        $brideNames = $this->normalizeLocalizedName($validated['bride_name']);
        $groomName = $groomNames['en'] ?: $groomNames['ar'];
        $brideName = $brideNames['en'] ?: $brideNames['ar'];
        [$slug, $code] = $this->routeParts($validated, $invitation, $groomName, $brideName);

        if ($this->publicRoutes->exists($slug, $code, $invitation)) {
            throw ValidationException::withMessages([
                'public_path' => ['This route exists before. Choose another route.'],
            ]);
        }

        return [
            ...Arr::only($validated, [
                'hero',
                'loading',
                'event',
                'love_story',
                'gallery',
                'countdown',
                'rsvp',
                'footer',
                'audio',
                'party_upload',
                'organizer_username',
                'organizer_password',
            ]),
            'groom_name' => $this->encodeLocalizedName($groomNames),
            'bride_name' => $this->encodeLocalizedName($brideNames),
            'couple_display_name' => $this->normalizeDisplayName($validated['couple_display_name'] ?? null, "{$groomName} & {$brideName}"),
            'is_published' => $validated['is_published'] ?? true,
            'template' => $validated['template'] ?? $invitation?->template ?? 'classic',
            'locale' => $validated['locale'] ?? $invitation?->locale ?? 'en',
            'font_family' => $validated['font_family'] ?? $invitation?->font_family ?? 'elegant',
            'slug' => $slug,
            'code' => $code,
        ];
    }

    private function routeParts(array $validated, ?Invitation $invitation, string $groomName, string $brideName): array
    {
        if (! empty($validated['public_path'])) {
            return $this->splitPublicPath($validated['public_path']);
        }

        $slug = Invitation::makeSlug($groomName, $brideName);

        return [$slug, $invitation?->code ?? $this->generateCode($slug)];
    }

    private function splitPublicPath(string $publicPath): array
    {
        if (! preg_match('/^(.*)-(\d{4})$/', $publicPath, $matches)) {
            abort(404);
        }

        return [$matches[1], $matches[2]];
    }

    private function normalizeLocalizedName(mixed $name): array
    {
        if (is_array($name)) {
            $english = trim((string) ($name['en'] ?? ''));
            $arabic = trim((string) ($name['ar'] ?? ''));

            return [
                'en' => $english !== '' ? $english : $arabic,
                'ar' => $arabic !== '' ? $arabic : $english,
            ];
        }

        $name = trim((string) $name);

        return ['en' => $name, 'ar' => $name];
    }

    private function encodeLocalizedName(array $name): string
    {
        if (($name['en'] ?? '') === ($name['ar'] ?? '')) {
            return $name['en'] ?? '';
        }

        return json_encode($name, JSON_UNESCAPED_UNICODE);
    }

    private function normalizeDisplayName(mixed $displayName, string $fallback): string
    {
        if (is_array($displayName)) {
            $english = trim((string) ($displayName['en'] ?? ''));
            $arabic = trim((string) ($displayName['ar'] ?? ''));

            return json_encode([
                'en' => $english !== '' ? $english : $fallback,
                'ar' => $arabic !== '' ? $arabic : ($english !== '' ? $english : $fallback),
            ], JSON_UNESCAPED_UNICODE);
        }

        $displayName = trim((string) $displayName);

        return $displayName !== '' ? $displayName : $fallback;
    }

    private function generateCode(string $slug): string
    {
        do {
            $code = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        } while ($this->publicRoutes->exists($slug, $code));

        return $code;
    }

    private function verifyAdmin(Request $request): bool
    {
        $username = $request->header('X-Organizer-Username');
        $password = $request->header('X-Organizer-Password');

        if (empty($username) || empty($password)) {
            return false;
        }

        $admin = \Illuminate\Support\Facades\DB::table('admins')
            ->where('username', $username)
            ->first();

        return $admin && \Illuminate\Support\Facades\Hash::check($password, $admin->password);
    }

    public function deleteRsvp(Request $request, string $publicPath, int $id): JsonResponse
    {
        if (! $this->verifyAdmin($request)) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        [$slug, $code] = $this->splitPublicPath($publicPath);
        $invitation = Invitation::where('slug', $slug)->where('code', $code)->first();
        if (!$invitation) {
            abort(404);
        }

        $rsvp = $invitation->rsvps()->find($id);
        if ($rsvp) {
            $rsvp->delete();
        }

        return response()->json(['message' => 'RSVP deleted successfully.']);
    }

    public function deleteAllRsvps(Request $request, string $publicPath): JsonResponse
    {
        if (! $this->verifyAdmin($request)) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        [$slug, $code] = $this->splitPublicPath($publicPath);
        $invitation = Invitation::where('slug', $slug)->where('code', $code)->first();
        if (!$invitation) {
            abort(404);
        }

        $invitation->rsvps()->delete();

        return response()->json(['message' => 'All RSVPs deleted successfully.']);
    }

    public function deleteGuestPhoto(Request $request, string $publicPath, int $id): JsonResponse
    {
        if (! $this->verifyAdmin($request)) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        [$slug, $code] = $this->splitPublicPath($publicPath);
        $invitation = Invitation::where('slug', $slug)->where('code', $code)->first();
        if (!$invitation) {
            abort(404);
        }

        $photo = $invitation->guestPhotos()->find($id);
        if ($photo) {
            $photo->delete();
        }

        return response()->json(['message' => 'Guest photo deleted successfully.']);
    }

    public function deleteAllGuestPhotos(Request $request, string $publicPath): JsonResponse
    {
        if (! $this->verifyAdmin($request)) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        [$slug, $code] = $this->splitPublicPath($publicPath);
        $invitation = Invitation::where('slug', $slug)->where('code', $code)->first();
        if (!$invitation) {
            abort(404);
        }

        $invitation->guestPhotos()->delete();

        return response()->json(['message' => 'All guest photos deleted successfully.']);
    }

    public function listAdmins(): JsonResponse
    {
        $admins = \Illuminate\Support\Facades\DB::table('admins')
            ->select('id', 'username', 'created_at')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json(['data' => $admins]);
    }

    public function createAdmin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:admins,username'],
            'password' => ['required', 'string', 'min:6', 'max:255'],
        ]);

        $id = \Illuminate\Support\Facades\DB::table('admins')->insertGetId([
            'username' => $validated['username'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'data' => [
                'id' => $id,
                'username' => $validated['username'],
                'created_at' => now(),
            ]
        ], 201);
    }

    public function deleteAdmin(int $id): JsonResponse
    {
        $adminCount = \Illuminate\Support\Facades\DB::table('admins')->count();
        if ($adminCount <= 1) {
            return response()->json(['message' => 'Cannot delete the only remaining admin account.'], 422);
        }

        $admin = \Illuminate\Support\Facades\DB::table('admins')->where('id', $id)->first();
        if ($admin && $admin->username === 'wil') {
            return response()->json(['message' => 'Cannot delete the main admin account (wil).'], 422);
        }

        \Illuminate\Support\Facades\DB::table('admins')->where('id', $id)->delete();

        return response()->json(status: 204);
    }
}
