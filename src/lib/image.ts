/**
 * Turn an uploaded photo into a small 16:9 JPEG data URL (center crop, cover).
 * Photos live in localStorage with the rest of the resume (~5 MB quota), so they
 * are downscaled before saving: 960×540 is sharp in print at the thumbnail's size.
 */
export async function fileToThumb(file: File, width = 960, height = 540, quality = 0.82): Promise<string> {
  const bitmap = await createImageBitmap(file); // honours EXIF orientation
  const scale = Math.max(width / bitmap.width, height / bitmap.height);
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.fillStyle = '#fff'; // flatten transparent PNGs onto white
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, (width - w) / 2, (height - h) / 2, w, h);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', quality);
}
