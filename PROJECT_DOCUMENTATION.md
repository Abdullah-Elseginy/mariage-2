# Marriage Platform - Project Documentation

Updated: June 20, 2026

This document describes the current Marriage/WIL monorepo. The platform creates and publishes wedding invitations, Eid greetings, birthday greetings, and interactive love messages.

## 1. Applications

| Application | Folder | Purpose | Local URL |
|---|---|---|---|
| Laravel API | `backend-mariage/` | Data, media, public endpoints, organizer data, admin CRUD | `http://localhost:8000` |
| Public frontend | `frontend-mariage/` | Public invitation and greeting experiences | `http://localhost:3000` |
| Admin dashboard | `dashboard-marriage/` | Create, edit, filter, publish, and open content | Usually `http://localhost:3001` |

Production:

- Backend: Railway
- Public frontend: Vercel
- Dashboard: Vercel
- Database: MySQL
- Uploaded media: Railway persistent Volume mounted at `/app/storage/app/public`

## 2. Main Features

- Six wedding invitation templates.
- One Eid greeting template.
- Three birthday greeting templates.
- One cinematic love message template.
- Stable global template IDs from 1 through 11.
- Arabic and English content with RTL support.
- Four selectable event font families.
- Image and audio uploads from the dashboard.
- Client-side image compression before upload.
- Published and draft content.
- Local/global backend switching for development and production.
- Live demo records separated from customer-created records.
- Search, template, type, date, and sort filters.
- RSVP collection and organizer dashboard.
- Guest photo uploads for invitations.
- Shared WIL platform footer with WhatsApp, portfolio, Facebook, Instagram, and TikTok links.
- Persistent media protection for Railway deployments.

## 3. Repository Structure

```text
marriage/
|-- PROJECT_DOCUMENTATION.md
|-- TEMPLATE_IDS.md
|-- DEPLOYMENT_CHECKLIST.md
|-- backend-mariage/
|   |-- app/Http/Controllers/Api/V1/
|   |-- app/Http/Requests/Api/V1/
|   |-- app/Http/Resources/
|   |-- app/Models/
|   |-- app/Support/
|   |-- database/migrations/
|   |-- routes/
|   `-- tests/Feature/Api/
|-- frontend-mariage/
|   `-- src/
|       |-- components/
|       |-- screens/
|       |-- store/
|       |-- styles/
|       `-- utils/
`-- dashboard-marriage/
    `-- src/
        |-- Dashboard/
        |-- components/
        |-- locales/
        `-- utils/
```

## 4. Global Template IDs

Template IDs are unique across all categories and must never be renumbered.

| ID | Category | Template key | Display name |
|---:|---|---|---|
| 1 | Invitation | `classic` | Classic |
| 2 | Invitation | `signature` | Signature |
| 3 | Invitation | `royal` | Royal Entrance |
| 4 | Invitation | `love-letter` | Love Letter |
| 5 | Invitation | `floral-butterfly` | Floral Butterfly |
| 6 | Invitation | `modern-minimal` | Modern Minimalist |
| 7 | Eid Greeting | `default` | Default Eid |
| 8 | Birthday Greeting | `default` | Classic Romantic |
| 9 | Birthday Greeting | `romantic` | Love & Velvet |
| 10 | Birthday Greeting | `neon` | Neon Galaxy |
| 11 | Love Message | `happy-message` | Happy Message |

Source files:

- `TEMPLATE_IDS.md`
- `dashboard-marriage/src/utils/templateRegistry.js`

New templates must use the next unused global ID.

## 5. Public Routes

All public records use:

```text
{slug}-{4-digit-code}
```

Examples:

```text
abdullah-walaa-4321
demo-happy-message-0011
```

| Content | Public route |
|---|---|
| Invitation | `/:invitationPath` |
| Invitation organizer | `/:invitationPath/organizer` |
| Eid greeting | `/eid/:eidPath` |
| Birthday greeting | `/birthday/:birthdayPath` |
| Love message | `/love/:loveMessagePath` |

## 6. Backend

### Stack

- PHP 8.2+
- Laravel 12
- Eloquent ORM
- MySQL in local/production
- SQLite-style isolated database behavior in automated tests
- PHPUnit 11

### Models

| Model | Main data |
|---|---|
| `Invitation` | Couple names, template, locale, font, sections, organizer credentials |
| `EidGreeting` | Recipient, sender, template content, locale, font |
| `BirthdayGreeting` | Recipient, sender, template, content, locale, font, demo flag |
| `LoveMessage` | Recipient, sender, interactive content, locale, font, demo flag |
| `Rsvp` | Guest name, attendance, message, locale |
| `GuestPhoto` | Invitation guest-uploaded image |
| `Admin` | Dashboard administrator account |

### Public API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Application and persistent-media health |
| `GET` | `/api/v1/invitations/{publicPath}` | Published invitation |
| `GET` | `/api/v1/invitations/{publicPath}/organizer` | Organizer dashboard data |
| `POST` | `/api/v1/invitations/{publicPath}/guest-photos` | Guest photo upload |
| `DELETE` | `/api/v1/invitations/{publicPath}/guest-photos` | Delete all guest photos |
| `DELETE` | `/api/v1/invitations/{publicPath}/guest-photos/{id}` | Delete one guest photo |
| `DELETE` | `/api/v1/invitations/{publicPath}/rsvps` | Delete all invitation RSVPs |
| `DELETE` | `/api/v1/invitations/{publicPath}/rsvps/{id}` | Delete one RSVP |
| `GET` | `/api/v1/eid-greetings/{publicPath}` | Published Eid greeting |
| `GET` | `/api/v1/birthday-greetings/{publicPath}` | Published birthday greeting |
| `GET` | `/api/v1/love-messages/{publicPath}` | Published love message |
| `POST` | `/api/v1/rsvps` | Submit RSVP |

### Admin API

All CRUD resources support list, create, show, update, and delete:

```text
/api/v1/admin/invitations
/api/v1/admin/eid-greetings
/api/v1/admin/birthday-greetings
/api/v1/admin/love-messages
```

Additional endpoints:

| Method | Endpoint |
|---|---|
| `POST` | `/api/v1/admin/media` |
| `GET` | `/api/v1/admin/admins` |
| `POST` | `/api/v1/admin/admins` |
| `DELETE` | `/api/v1/admin/admins/{id}` |

List endpoints support combinations of:

- `search`
- `template`
- `is_demo`
- `date`
- `sort=latest|oldest`
- pagination

### Media Upload

`POST /api/v1/admin/media` accepts multipart data:

| Field | Value |
|---|---|
| `type` | `gallery` or `audio` |
| `file` | Maximum 20 MB |

Images:

- JPG/JPEG
- PNG
- WebP
- GIF

Audio:

- MP3
- WAV
- OGG
- M4A
- MP4
- AAC

The dashboard compresses non-GIF images before upload:

- Maximum dimension: 1920px
- JPEG/WebP quality: 0.82
- Upload timeout: 90 seconds
- Individual upload buttons show loading state

### Persistent Media Safety

Uploaded media must not be stored only inside the Railway deployment container.

Required Railway Volume mount:

```text
/app/storage/app/public
```

Configuration:

```env
MEDIA_DISK=public
```

`PersistentMediaStorage` provides one media disk for:

- Invitation galleries
- Birthday albums
- Love message galleries
- Final surprise photos
- Audio
- Guest photos

Production safeguards:

- `/api/v1/health` returns HTTP 503 when Railway has no matching persistent Volume.
- Upload endpoints reject uploads when production storage is temporary.
- Stored `/storage/...` URLs are normalized to the current backend host.
- Birthday and love resources rewrite stale storage origins.
- Public React pages also normalize media URLs as a second layer of protection.

A Volume protects files during redeploys. Railway Volume backups should also be enabled to protect against accidental deletion.

### Important Support Classes

| Class | Responsibility |
|---|---|
| `PublicRouteUniqueness` | Prevent duplicate public paths across categories |
| `MediaUrlNormalizer` | Rewrite stale `/storage` URLs to the current backend |
| `PersistentMediaStorage` | Select and validate the durable media disk |

## 7. Public Frontend

### Stack

- React 19
- Create React App
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS
- Framer Motion
- i18next
- React Helmet
- canvas-confetti
- lucide-react/react-icons

### Invitation Templates

```text
frontend-mariage/src/screens/HomeScreen/InvitationsTemplates/
|-- ClassicTemplate/
|-- SignatureTemplate/
|-- RoyalEntranceTemplate/
|-- LoveLetterTemplate/
|-- FloralButterflyTemplate/
`-- ModernMinimalistTemplate/
```

Invitation sections can include:

- Loading experience
- Hero/envelope
- Event details and map
- Love story
- Gallery
- Countdown
- RSVP
- Guest photo upload
- Audio player
- Template-compatible platform footer

### Eid Greeting

Path:

```text
frontend-mariage/src/screens/EidTemplates/
```

Sections:

- Hero
- Wishes
- Moments
- Pulses
- Interactive instrument
- Rain effects
- Footer

### Birthday Greetings

Path:

```text
frontend-mariage/src/screens/BirthdayTemplates/
```

Templates:

- ID 8: Classic Romantic
- ID 9: Love & Velvet
- ID 10: Neon Galaxy

Shared/available sections:

- Lock gate
- Hero
- Countdown
- Wishes
- Album
- Envelope letter
- Celebration reveal
- Audio
- Footer

Birthday image URLs are normalized before rendering so a changed backend domain does not break existing stored links.

### Love Messages

Path:

```text
frontend-mariage/src/screens/LoveMessages/
```

Template ID 11 contains:

1. Mystery gift intro
2. Full-screen countdown reveal
3. Reasons I Love You
4. Memory gallery with image modal
5. Animated envelope and love letter
6. Secret boxes
7. Real-time love timer
8. Final surprise
9. Collapsible bottom music player
10. Scroll progress and background effects

Behavior:

- Empty dashboard sections are automatically hidden.
- Gift click reveals the message and scrolls to the action.
- Countdown disables page scrolling while active.
- Memory images open in a centered modal.
- Arabic pagination direction follows RTL.
- Final heart scrolls to the couple photo.
- Music attempts autoplay and retries after the first gift interaction because browsers can block autoplay.
- Love-message language is selected from the dashboard and applied automatically without a public language button.
- Gallery, final image, and audio URLs are normalized before rendering.

## 8. Shared Branding and Fonts

### Platform Footer

All public templates use a footer theme compatible with their own colors.

Footer links:

- WhatsApp icon/link
- Portfolio: `https://marriage-five-pi.vercel.app/`
- Facebook
- Instagram
- TikTok
- WIL copyright/branding

The WhatsApp phone number is not displayed as plain text. Legacy template-specific WhatsApp number blocks were removed.

### Font Families

The dashboard offers four selectable font themes before template selection. Each theme supports Arabic and English and shows a preview example.

The selected value is stored in:

```text
font_family
```

Public pages apply it through:

```text
wil-font-theme
data-font-family="{font_family}"
```

Global font styles:

```text
frontend-mariage/src/styles/fontThemes.css
```

## 9. Localization

Supported languages:

- English: `en`
- Arabic: `ar`

Public behavior:

- `lang` and `dir` are updated on `<html>`.
- Arabic uses RTL.
- Invitations support localized API buckets and legacy migrated content.
- Birthday and Eid pages use the saved content locale.
- Love message ID 11 initializes i18next from the locale saved in the dashboard.

Dashboard behavior:

- Dashboard UI is translated with i18next.
- Content editors use `ContentLocaleSwitcher`.
- Arabic and English defaults are available for invitation, Eid, birthday, and love content.

## 10. Dashboard

### Routes

| Route | Screen |
|---|---|
| `/completed` | Completed templates grouped by category |
| `/invitations/new` | New invitation |
| `/eid-greetings/new` | New Eid greeting |
| `/birthday-greetings/new` | New birthday greeting |
| `/love-messages/new` | New love message |
| `/settings` | Admin accounts/settings |

List routes redirect to `/completed`; category pages can also render embedded inside the completed screen.

### Main Dashboard Areas

- Completed templates
- New invitation
- New Eid greeting
- New birthday greeting
- New love message
- Admin/settings

### Editors

All category editors follow the same dashboard visual system:

- Template picker with global ID
- Font picker with preview
- Locale/content switcher
- Published toggle
- Public path
- Section tabs
- Media upload controls
- Fixed modal header actions for edit
- Button-level loading states
- Open/copy public URL actions

### Completed Lists and Live Demos

Birthday and love-message records support `is_demo`.

- Live demos appear in a dedicated "Template Live Demos" section.
- Customer-created records appear separately.
- Demo records are ordered before client records at API level.
- ID 9 and ID 11 have dashboard live demo cards.
- Template preview assets include `id9.png` and `id11.png`.

### Filters

Invitation, birthday, and love-message lists use a consistent filter layout:

- Search
- Template
- Type/demo status
- Date
- Latest/oldest sort

## 11. Data Shapes

### Invitation

Top-level JSON sections:

```text
loading
hero
event
love_story
gallery
countdown
rsvp
footer
audio
party_upload
```

### Birthday Greeting

Content sections can include:

```text
basic
hero
countdown
wishes
album
letter
audio
footer
```

### Love Message

Content sections:

```text
intro
countdown_reveal
reasons
gallery
letter
secret_boxes
love_timer
final_surprise
audio
```

Gallery item:

```json
{
  "image": "https://backend.example/storage/...",
  "title": "Our first trip",
  "description": "A short message under the photo",
  "date": "2026-02-14"
}
```

## 12. Environment Variables

### Backend

```env
APP_ENV=local
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mariage
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=local
MEDIA_DISK=public
```

Production Railway additionally requires a Volume mounted at:

```text
/app/storage/app/public
```

### Public Frontend

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
```

### Dashboard

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
REACT_APP_PUBLIC_FRONTEND_URL=http://localhost:3000
```

Both React applications support local/global backend selection through `backend_mode` in local storage and optional `?backend=local|global`.

## 13. Local Development

### Backend

```powershell
cd backend-mariage
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve
```

### Public Frontend

```powershell
cd frontend-mariage
npm install
npm start
```

### Dashboard

```powershell
cd dashboard-marriage
npm install
$env:PORT=3001
npm start
```

### Tests and Builds

```powershell
cd backend-mariage
php artisan test

cd ..\frontend-mariage
npm.cmd run build

cd ..\dashboard-marriage
npm.cmd run build
```

Current backend verification: 32 tests passing.

## 14. Production Deployment

See `DEPLOYMENT_CHECKLIST.md` for the exact checklist.

Critical rules:

1. Railway backend root directory must be `backend-mariage`.
2. `php artisan migrate --force` runs before deployment.
3. Do not deploy uploaded media without the persistent Railway Volume.
4. Keep the production MySQL database attached.
5. Set production `APP_URL` to the Railway public URL.
6. Set Vercel API variables to the Railway `/api/v1` URL.
7. Enable Railway Volume backups.

## 15. Known Limitations and Risks

| Area | Current status |
|---|---|
| Admin authentication | Admin CRUD endpoints are not protected by a complete production authentication layer |
| JSON validation | Section schemas are only partially validated server-side |
| Autoplay | Browser policies may block music until the first user interaction |
| Deleted old media | Files already deleted from temporary Railway storage cannot be reconstructed by URL normalization |
| Railway Volume | Must be attached in Railway settings; Git code cannot create the service Volume |
| Backup | Persistent storage still needs Railway backups for accidental deletion protection |

## 16. Key Files

| Purpose | File |
|---|---|
| Public routes | `frontend-mariage/src/App.js` |
| Dashboard routes | `dashboard-marriage/src/App.js` |
| Backend routes | `backend-mariage/routes/api.php` |
| Template IDs | `TEMPLATE_IDS.md` |
| Dashboard template registry | `dashboard-marriage/src/utils/templateRegistry.js` |
| Invitation content localization | `frontend-mariage/src/utils/invitationContent.js` |
| Media upload client | `dashboard-marriage/src/utils/mediaUploadApi.js` |
| Media upload API | `backend-mariage/app/Http/Controllers/Api/V1/MediaUploadController.php` |
| Persistent storage guard | `backend-mariage/app/Support/PersistentMediaStorage.php` |
| Media URL repair | `backend-mariage/app/Support/MediaUrlNormalizer.php` |
| Deployment configuration | `backend-mariage/railway.json` |
| Deployment checklist | `DEPLOYMENT_CHECKLIST.md` |
