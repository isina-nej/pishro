import sharp from "sharp";
import { detectImageType } from "@/lib/upload-validation";

/** Compress verified raster uploads, preserving originals when already smaller.
 * Existing stored objects and their URLs are never changed.
 */
export async function optimizePublicImage(
  buffer: Buffer,
  { maxWidth = 1920, maxHeight = 1920, quality = 80 }: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<{
  buffer: Buffer;
  ext: "jpg" | "png" | "webp";
  mime: string;
  width: number;
  height: number;
}> {
  const detected = detectImageType(buffer);
  if (!detected) throw new Error("Invalid JPEG, PNG or WebP image");
  const metadata = await sharp(buffer, { failOn: "error", limitInputPixels: 40_000_000 }).metadata();
  if (!metadata.width || !metadata.height) throw new Error("Cannot read image dimensions");
  const swapped = [5, 6, 7, 8].includes(metadata.orientation || 1);
  const original = {
    buffer, ext: detected.ext, mime: detected.mime,
    width: swapped ? metadata.height : metadata.width,
    height: swapped ? metadata.width : metadata.height,
  };
  // Animated WebP must not lose its frames.
  if ((metadata.pages || 1) > 1) return original;
  const { data, info } = await sharp(buffer, { failOn: "error", limitInputPixels: 40_000_000 })
    .rotate()
    .resize({ width: maxWidth, height: maxHeight, fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toBuffer({ resolveWithObject: true });
  if (data.length >= buffer.length) return original;
  return { buffer: data, ext: "webp" as const, mime: "image/webp", width: info.width, height: info.height };
}
