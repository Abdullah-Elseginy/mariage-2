const MAX_CANVAS_DIMENSION = 2560;
const MIN_QUALITY = 0.2;
const MAX_QUALITY = 0.92;

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
    quality,
  );
});

const compressedName = (name, mimeType) => {
  const extension = mimeType === 'image/webp' ? 'webp' : 'jpg';
  return `${name.replace(/\.[^.]+$/, '') || 'image'}.${extension}`;
};

export async function compressImageToSize(file, maxSizeKb) {
  const maxBytes = Math.floor(Number(maxSizeKb) * 1024);
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!Number.isFinite(maxBytes) || maxBytes <= 0) return file;
  if (file.size <= maxBytes && supportedTypes.includes(file.type)) return file;
  if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image.`);

  const image = await loadImage(file);
  const initialScale = Math.min(1, MAX_CANVAS_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
  let width = Math.max(1, Math.round(image.naturalWidth * initialScale));
  let height = Math.max(1, Math.round(image.naturalHeight * initialScale));
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Image compression is not supported by this browser.');

  for (let resizeAttempt = 0; resizeAttempt < 10; resizeAttempt += 1) {
    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    let low = MIN_QUALITY;
    let high = MAX_QUALITY;
    let acceptableBlob = null;
    let smallestBlob = null;

    for (let qualityAttempt = 0; qualityAttempt < 8; qualityAttempt += 1) {
      const quality = (low + high) / 2;
      const blob = await canvasToBlob(canvas, 'image/webp', quality);
      if (!smallestBlob || blob.size < smallestBlob.size) smallestBlob = blob;

      if (blob.size <= maxBytes) {
        acceptableBlob = blob;
        low = quality;
      } else {
        high = quality;
      }
    }

    if (acceptableBlob) {
      return new File([acceptableBlob], compressedName(file.name, acceptableBlob.type), {
        type: acceptableBlob.type,
        lastModified: file.lastModified,
      });
    }

    const ratio = Math.min(0.85, Math.sqrt(maxBytes / Math.max(1, smallestBlob?.size || maxBytes * 2)) * 0.9);
    width = Math.max(1, Math.floor(width * ratio));
    height = Math.max(1, Math.floor(height * ratio));
  }

  throw new Error(`Could not compress ${file.name} to ${maxSizeKb} KB.`);
}
