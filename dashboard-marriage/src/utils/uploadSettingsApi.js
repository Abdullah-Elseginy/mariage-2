import { getBackendUrl } from './apiConfig';
import { formatDashboardApiError } from './apiErrors';

export const DEFAULT_UPLOAD_SETTINGS = {
  guest_image_max_kb: 350,
  guest_max_images: 4,
  gallery_image_max_kb: 500,
};

let cachedSettings = null;

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(formatDashboardApiError(payload, `Request failed with status ${response.status}`));
  }
  return payload.data;
};

export const uploadSettingsApi = {
  async get({ refresh = false } = {}) {
    if (cachedSettings && !refresh) return cachedSettings;
    const response = await fetch(`${getBackendUrl()}/upload-settings`, {
      headers: { Accept: 'application/json' },
    });
    cachedSettings = { ...DEFAULT_UPLOAD_SETTINGS, ...(await parseResponse(response)) };
    return cachedSettings;
  },

  async update(settings) {
    const response = await fetch(`${getBackendUrl()}/admin/upload-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(settings),
    });
    cachedSettings = { ...DEFAULT_UPLOAD_SETTINGS, ...(await parseResponse(response)) };
    return cachedSettings;
  },
};
