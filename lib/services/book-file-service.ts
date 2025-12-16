import { saveFileToStorage, getRelativePathFromUrl, moveFileInStorage } from "./storage-adapter";
// lightweight unique id generator to avoid extra deps
function generateUniqueId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
}

export type BookFileType = "image" | "file" | "audio";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
const MAX_AUDIO_SIZE = 300 * 1024 * 1024; // 300MB

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const ALLOWED_FILE_TYPES = ["application/pdf", "application/epub+zip", "application/octet-stream", "application/zip"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/m4a", "audio/ogg", "audio/wav"];

export interface UploadResult {
  url: string;
  relativePath: string;
  fileName: string;
  size: number;
  mimeType: string;
}

export async function uploadBookFile({
  file,
  type,
  desiredFileName,
}: {
  file: File;
  type: BookFileType;
  desiredFileName?: string; // optional requested filename (without path)
}): Promise<UploadResult> {
  // Validate
  const mimeType = file.type;
  const size = file.size;

  if (type === "image" && !ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    throw new Error("نوع فایل تصویر مجاز نیست");
  }
  if (type === "file" && !ALLOWED_FILE_TYPES.includes(mimeType)) {
    throw new Error("نوع فایل کتاب مجاز نیست");
  }
  if (type === "audio" && !ALLOWED_AUDIO_TYPES.includes(mimeType)) {
    throw new Error("نوع فایل صوتی مجاز نیست");
  }

  if (type === "image" && size > MAX_IMAGE_SIZE) {
    throw new Error("حجم تصویر بیش از حد مجاز است");
  }
  if (type === "file" && size > MAX_FILE_SIZE) {
    throw new Error("حجم فایل کتاب بیش از حد مجاز است");
  }
  if (type === "audio" && size > MAX_AUDIO_SIZE) {
    throw new Error("حجم فایل صوتی بیش از حد مجاز است");
  }

  // Determine file name
  const extension = getExtensionFromMime(mimeType) || getExtensionFromName(file.name) || "bin";
  const safeName = desiredFileName ? sanitizeFileName(desiredFileName) : undefined;
  const uniqueName = `${generateUniqueId()}-${safeName || sanitizeFileName(file.name)}`;
  const fileName = uniqueName.endsWith(`.${extension}`) ? uniqueName : `${uniqueName}.${extension}`;

  const relativePath = `books/${type}s/${fileName}`; // books/images or books/files or books/audios

  // Read file into buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  const url = await saveFileToStorage(buffer, relativePath);

  return {
    url,
    relativePath,
    fileName,
    size,
    mimeType,
  };
}

export async function renameBookFile(url: string, newFileName: string): Promise<UploadResult> {
  const oldRelative = getRelativePathFromUrl(url);
  const dir = oldRelative.substring(0, oldRelative.lastIndexOf("/"));
  const sanitized = sanitizeFileName(newFileName);
  // preserve extension if provided, otherwise keep original
  const ext = getExtensionFromName(newFileName) || oldRelative.split(".").pop() || "bin";
  const newRelative = `${dir}/${sanitized}.${ext}`;
  const newUrl = await moveFileInStorage(oldRelative, newRelative);

  // size and mime not known here; set placeholders (caller may not need them)
  return {
    url: newUrl,
    relativePath: newRelative,
    fileName: `${sanitized}.${ext}`,
    size: 0,
    mimeType: "",
  };
}

function getExtensionFromMime(mime: string): string | null {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "application/pdf": "pdf",
    "application/epub+zip": "epub",
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/mp4": "m4a",
    "audio/m4a": "m4a",
    "audio/ogg": "ogg",
    "audio/wav": "wav",
  };
  return map[mime] || null;
}

function getExtensionFromName(name: string): string | null {
  const parts = name.split(".");
  if (parts.length > 1) return parts.pop() || null;
  return null;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9\-_\.\u0600-\u06FF ]/g, "").replace(/\s+/g, "_").substring(0, 200);
}
