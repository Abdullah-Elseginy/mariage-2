# Production Deployment Checklist

## Railway backend

- Service root directory: `backend-mariage`
- Config file: `backend-mariage/railway.json`
- The pre-deploy command runs `php artisan migrate --force`.
- Set `APP_ENV=production`, `APP_DEBUG=false`, and `APP_URL` to the Railway public URL.
- Keep the existing MySQL environment variables connected to the production database.
- Attach a Railway Volume to the backend service at exactly `/app/storage/app/public`.
- Confirm Railway exposes `RAILWAY_VOLUME_MOUNT_PATH=/app/storage/app/public`.
- Keep `MEDIA_DISK=public`. Do not set `MEDIA_STORAGE_ROOT` unless the Volume uses another absolute path.
- The `/api/v1/health` deployment check returns HTTP 503 when Railway uses temporary local media storage, preventing an unsafe deployment from replacing production.
- Ensure `public/storage` is linked to `storage/app/public`.
- Enable Railway Volume backups. A persistent Volume protects redeploys; backups protect accidental deletion.

## Vercel dashboard

- Project root directory: `dashboard-marriage`
- Build command: `npm run build`
- Output directory: `build`
- Set:
  - `REACT_APP_API_BASE_URL=https://mariage-2-production.up.railway.app/api/v1`
  - `REACT_APP_PUBLIC_FRONTEND_URL=https://marriage-five-pi.vercel.app`
- `dashboard-marriage/vercel.json` provides SPA route rewrites.

## Vercel public frontend

- Project root directory: `frontend-mariage`
- Build command: `npm run build`
- Output directory: `build`
- Set:
  - `REACT_APP_API_BASE_URL=https://mariage-2-production.up.railway.app/api/v1`
- `frontend-mariage/vercel.json` provides SPA route rewrites.
