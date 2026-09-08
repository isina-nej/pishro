/** Magic-byte sniffing for uploads — never trust file.type / extension. */

export type DetectedImage = { ext: "jpg" | "png" | "webp"; mime: string };

/** Returns detected type or null (svg / text / unknown rejected). */
export function detectImageType(buffer: Buffer): DetectedImage | null {
  if (buffer.length < 12) return null;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ext: "jpg", mime: "image/jpeg" };
  }
  // PNG: 89 50 4E 47
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { ext: "png", mime: "image/png" };
  }
  // WebP: RIFF....WEBP
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { ext: "webp", mime: "image/webp" };
  }
  return null;
}

export type DetectedFile =
  | { kind: "image"; ext: "jpg" | "png" | "webp"; mime: string }
  | { kind: "pdf"; ext: "pdf"; mime: "application/pdf" }
  | { kind: "video"; ext: "mp4" | "mov" | "avi" | "mkv" | "webm"; mime: string }
  | { kind: "audio"; ext: "mp3" | "wav" | "ogg" | "m4a" | "aac" | "webm"; mime: string };

const VIDEO_MIME_TO_EXT: Record<string, DetectedFile & { kind: "video" }> = {
  "video/mp4": { kind: "video", ext: "mp4", mime: "video/mp4" },
  "video/quicktime": { kind: "video", ext: "mov", mime: "video/quicktime" },
  "video/x-msvideo": { kind: "video", ext: "avi", mime: "video/x-msvideo" },
  "video/x-matroska": { kind: "video", ext: "mkv", mime: "video/x-matroska" },
  "video/webm": { kind: "video", ext: "webm", mime: "video/webm" },
};

const AUDIO_MIME_TO_EXT: Record<string, DetectedFile & { kind: "audio" }> = {
  "audio/mpeg": { kind: "audio", ext: "mp3", mime: "audio/mpeg" },
  "audio/mp3": { kind: "audio", ext: "mp3", mime: "audio/mp3" },
  "audio/wav": { kind: "audio", ext: "wav", mime: "audio/wav" },
  "audio/x-wav": { kind: "audio", ext: "wav", mime: "audio/x-wav" },
  "audio/ogg": { kind: "audio", ext: "ogg", mime: "audio/ogg" },
  "audio/m4a": { kind: "audio", ext: "m4a", mime: "audio/m4a" },
  "audio/x-m4a": { kind: "audio", ext: "m4a", mime: "audio/x-m4a" },
  "audio/aac": { kind: "audio", ext: "aac", mime: "audio/aac" },
  "audio/webm": { kind: "audio", ext: "webm", mime: "audio/webm" },
};

/** PDF magic: %PDF- */
export function detectPdf(buffer: Buffer): DetectedFile | null {
  if (buffer.length < 5) return null;
  if (buffer.toString("ascii", 0, 5) === "%PDF-") {
    return { kind: "pdf", ext: "pdf", mime: "application/pdf" };
  }
  return null;
}

/** MP4/MOV ftyp box at offset 4 — mp4 / mov / m4a family. */
function detectFtyp(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;
  if (buffer.toString("ascii", 4, 8) !== "ftyp") return null;
  const brand = buffer.toString("ascii", 8, 12).toLowerCase();
  if (brand.includes("mp4") || brand === "isom" || brand === "iso2" || brand === "avc1") return "mp4";
  if (brand === "qt  " || brand.includes("qt")) return "mov";
  if (brand.includes("m4a") || brand.includes("m4b") || brand.includes("m4p")) return "m4a";
  return null;
}

/** EBML header — mkv / webm family. */
function detectEbml(buffer: Buffer): "mkv" | "webm" | null {
  if (buffer.length < 8) return null;
  if (buffer[0] !== 0x1a || buffer[1] !== 0x45 || buffer[2] !== 0xdf || buffer[3] !== 0xa3) return null;
  const head = buffer.subarray(0, Math.min(buffer.length, 4096)).toString("binary");
  if (head.includes("webm")) return "webm";
  if (head.includes("matroska")) return "mkv";
  return "mkv";
}

/** RIFF....WAVE / RIFF....WEBP */
function detectRiff(buffer: Buffer): "wav" | "webp" | null {
  if (buffer.length < 12) return null;
  if (buffer.toString("ascii", 0, 4) !== "RIFF") return null;
  const form = buffer.toString("ascii", 8, 12);
  if (form === "WAVE") return "wav";
  if (form === "WEBP") return "webp";
  return null;
}

/** MP3: ID3 header or frame sync FF Ex. OGG: OggS. */
function detectAudioFraming(buffer: Buffer): "mp3" | "ogg" | null {
  if (buffer.length < 4) return null;
  if (buffer.toString("ascii", 0, 3) === "ID3") return "mp3";
  if (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) return "mp3";
  if (buffer.toString("ascii", 0, 4) === "OggS") return "ogg";
  return null;
}

/**
 * Sniff video container from magic bytes. Extension is derived here —
 * never from the client filename. Returns null when unknown.
 */
export function detectVideo(buffer: Buffer): DetectedFile | null {
  const ftyp = detectFtyp(buffer);
  if (ftyp === "mp4") return { kind: "video", ext: "mp4", mime: "video/mp4" };
  if (ftyp === "mov") return { kind: "video", ext: "mov", mime: "video/quicktime" };
  if (ftyp === "m4a") return { kind: "video", ext: "mp4", mime: "video/mp4" };
  const ebml = detectEbml(buffer);
  if (ebml === "mkv") return { kind: "video", ext: "mkv", mime: "video/x-matroska" };
  if (ebml === "webm") return { kind: "video", ext: "webm", mime: "video/webm" };
  return null;
}

/**
 * Sniff audio container from magic bytes. Returns null when unknown.
 */
export function detectAudio(buffer: Buffer): DetectedFile | null {
  const riff = detectRiff(buffer);
  if (riff === "wav") return { kind: "audio", ext: "wav", mime: "audio/wav" };
  const framing = detectAudioFraming(buffer);
  if (framing === "mp3") return { kind: "audio", ext: "mp3", mime: "audio/mpeg" };
  if (framing === "ogg") return { kind: "audio", ext: "ogg", mime: "audio/ogg" };
  const ftyp = detectFtyp(buffer);
  if (ftyp === "m4a") return { kind: "audio", ext: "m4a", mime: "audio/m4a" };
  const ebml = detectEbml(buffer);
  if (ebml === "webm") return { kind: "audio", ext: "webm", mime: "audio/webm" };
  return null;
}

/**
 * Validate a sniffed file against an allow-list of container kinds.
 * Extension + mime both come from magic bytes, never from the client.
 */
export function sniffUpload(
  buffer: Buffer,
  allowed: Array<"image" | "pdf" | "video" | "audio">
): DetectedFile | null {
  if (allowed.includes("image")) {
    const img = detectImageType(buffer);
    if (img) return { kind: "image", ...img };
  }
  if (allowed.includes("pdf")) {
    const pdf = detectPdf(buffer);
    if (pdf) return pdf;
  }
  if (allowed.includes("video")) {
    const video = detectVideo(buffer);
    if (video) return video;
  }
  if (allowed.includes("audio")) {
    const audio = detectAudio(buffer);
    if (audio) return audio;
  }
  return null;
}

/** Crypto-random filename slug — never Math.random (predictable). */
export async function randomSlug(bytes = 8): Promise<string> {
  const { randomBytes } = await import("crypto");
  return randomBytes(bytes).toString("hex");
}

export { AUDIO_MIME_TO_EXT, VIDEO_MIME_TO_EXT };
