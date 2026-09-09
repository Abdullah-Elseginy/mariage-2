import { formatDashboardApiError } from './apiErrors';
import { getBackendUrl } from './apiConfig';
import { compressImageToSize } from './imageCompression';
import { DEFAULT_UPLOAD_SETTINGS, uploadSettingsApi } from './uploadSettingsApi';
const UPLOAD_TIMEOUT_MS = 90000;

export async function prepareMediaForUpload(file, type, maxSizeKb) {
  if (type !== 'gallery') return file;
  return compressImageToSize(file, maxSizeKb);
}

export async function uploadMedia(file, type) {
  let settings = DEFAULT_UPLOAD_SETTINGS;
  if (type === 'gallery') {
    settings = await uploadSettingsApi.get().catch(() => DEFAULT_UPLOAD_SETTINGS);
  }
  const preparedFile = await prepareMediaForUpload(file, type, settings.gallery_image_max_kb);
  const formData = new FormData();
  formData.append('type', type);
  formData.append('file', preparedFile);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    const response = await fetch(`${getBackendUrl()}/admin/media`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(formatDashboardApiError(
        payload,
        `Media upload failed with status ${response.status}`
      ));
    }

    return payload.data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Upload timed out for ${file.name}. Try a smaller file or a stronger connection.`);
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

