import imageCompression from "browser-image-compression";

// Uploaded names are timestamped and never reused, so browsers/CDN can keep them a year.
export const UPLOAD_CACHE_CONTROL = "31536000";

// Safari can't encode WebP from a canvas (it silently returns PNG), so use JPEG there.
let webpSupported: boolean | undefined;
function canEncodeWebp() {
  if (webpSupported === undefined) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    webpSupported = canvas.toDataURL("image/webp").startsWith("data:image/webp");
  }
  return webpSupported;
}

/** Resize and re-encode an image in the browser before uploading it. */
export function compressImage(file: File, maxWidthOrHeight: number, maxSizeMB: number) {
  return imageCompression(file, {
    maxWidthOrHeight,
    maxSizeMB,
    initialQuality: 0.8,
    fileType: canEncodeWebp() ? "image/webp" : "image/jpeg",
    useWebWorker: true,
  });
}
