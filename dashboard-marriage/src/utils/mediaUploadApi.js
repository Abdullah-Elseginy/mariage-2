import { formatDashboardApiError } from './apiErrors';
import { getBackendUrl } from './apiConfig';

const IMAGE_MAX_DIMENSION = 1920;
const IMAGE_QUALITY = 0.82;
const UPLOAD_TIMEOUT_MS = 90000;

const loadImage = (file) => new Promise((resolve, reject) => {
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);

  image.onload = () => {
    URL.revokeObjectURL(objectUrl);
    resolve(image);
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error(`Could not read ${file.name}.`));
  };
  image.src = objectUrl;
});

const canvasToBlob = (canvas, type, quality) => new Promise((resolve, reject) => {
  canvas.toBlob(
    (blob) => (blob ? resolve(blob) : reject(new Error('Image compression failed.'))),
    type,
    quality
  );
});

export async function prepareMediaForUpload(file, type) {
  if (
    type !== 'gallery'
    || !file.type.startsWith('image/')
    || file.type === 'image/gif'
  ) {
    return file;
  }

  const image = await loadImage(file);
  const scale = Math.min(1, IMAGE_MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) return file;

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const outputType = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
  const blob = await canvasToBlob(canvas, outputType, IMAGE_QUALITY);

  if (blob.size >= file.size && scale === 1) return file;

  const extension = outputType === 'image/webp' ? 'webp' : 'jpg';
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  return new File([blob], `${baseName}.${extension}`, {
    type: outputType,
    lastModified: file.lastModified,
  });
}

export async function uploadMedia(file, type) {
  const preparedFile = await prepareMediaForUpload(file, type);
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

