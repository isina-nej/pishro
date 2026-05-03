// @/lib/services/object-storage-service.ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

/**
 * تنظیمات Object Storage
 * سازگار با AWS S3, Arvan Cloud, Liara و سایر providerهای S3-compatible
 */
const s3Config = {
  region: process.env.S3_REGION || "default",
  endpoint: process.env.S3_ENDPOINT, // برای Arvan: https://s3.ir-thr-at1.arvanstorage.ir
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true, // برای S3-compatible providers
};

const s3Client = new S3Client(s3Config);

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";
const VIDEOS_FOLDER = "videos"; // پوشه اصلی ویدیوها
const HLS_FOLDER = "hls"; // پوشه HLS outputs
const THUMBNAILS_FOLDER = "thumbnails"; // پوشه thumbnailها

/**
 * تولید شناسه یکتا برای ویدیو
 */
export function generateVideoId(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * تولید نام فایل منحصر به فرد
 */
export function generateUniqueFileName(
  videoId: string,
  originalFileName: string
): string {
  const extension = originalFileName.split(".").pop();
  const timestamp = Date.now();
  return `${videoId}_${timestamp}.${extension}`;
}

/**
 * تولید مسیر فایل در storage
 */
export function getVideoStoragePath(videoId: string, fileName: string): string {
  return `${VIDEOS_FOLDER}/${videoId}/${fileName}`;
}

/**
 * تولید مسیر HLS در storage
 */
export function getHLSStoragePath(videoId: string): string {
  return `${HLS_FOLDER}/${videoId}`;
}

/**
 * تولید مسیر thumbnail در storage
 */
export function getThumbnailStoragePath(
  videoId: string,
  fileName: string
): string {
  return `${THUMBNAILS_FOLDER}/${videoId}/${fileName}`;
}

/**
 * تولید Signed Upload URL
 * این URL برای آپلود مستقیم فایل از مرورگر استفاده می‌شود
 */
export async function generateSignedUploadUrl(
  videoId: string,
  fileName: string,
  contentType: string,
  expiresIn: number = 3600 // 1 ساعت
): Promise<string> {
  try {
    const filePath = getVideoStoragePath(videoId, fileName);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed upload URL:", error);
    throw new Error("خطا در تولید URL آپلود");
  }
}

/**
 * تولید Signed Download URL
 * این URL برای دانلود یا پخش فایل استفاده می‌شود
 */
export async function generateSignedDownloadUrl(
  filePath: string,
  expiresIn: number = 300 // 5 دقیقه
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed download URL:", error);
    throw new Error("خطا در تولید URL دانلود");
  }
}

/**
 * تولید Signed URL برای HLS playlist
 */
export async function generateSignedHLSUrl(
  videoId: string,
  playlistFileName: string = "index.m3u8",
  expiresIn: number = 300 // 5 دقیقه
): Promise<string> {
  try {
    const hlsPath = `${getHLSStoragePath(videoId)}/${playlistFileName}`;
    return await generateSignedDownloadUrl(hlsPath, expiresIn);
  } catch (error) {
    console.error("Error generating signed HLS URL:", error);
    throw new Error("خطا در تولید URL پخش");
  }
}

/**
 * آپلود فایل به storage (از سمت سرور)
 */
export async function uploadFileToStorage(
  filePath: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<void> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Error uploading file to storage:", error);
    throw new Error("خطا در آپلود فایل");
  }
}

/**
 * دانلود فایل از storage (به سمت سرور)
 */
export async function downloadFileFromStorage(
  filePath: string
): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath,
  });

  const response = await s3Client.send(command);

  if (!response.Body) {
    throw new Error("فایل یافت نشد");
  }

  const chunks: Uint8Array[] = [];

  // بررسی نوع Body
  if (
    typeof (response.Body as AsyncIterable<Uint8Array>)[
      Symbol.asyncIterator
    ] === "function"
  ) {
    // AsyncIterable
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
  } else if (response.Body instanceof Uint8Array) {
    // Uint8Array مستقیم
    chunks.push(response.Body);
  } else {
    throw new Error("نوع بدنه فایل پشتیبانی نمی‌شود");
  }

  return Buffer.concat(chunks);
}

/**
 * حذف فایل از storage
 */
export async function deleteFileFromStorage(filePath: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file from storage:", error);
    throw new Error("خطا در حذف فایل");
  }
}

/**
 * بررسی وجود فایل در storage
 */
export async function fileExistsInStorage(filePath: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
    });

    await s3Client.send(command);
    return true;
  } catch {
    return false;
  }
}

/**
 * دریافت اطلاعات فایل از storage
 */
export async function getFileMetadata(filePath: string): Promise<{
  size: number;
  contentType: string;
  lastModified: Date;
}> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
    });

    const response = await s3Client.send(command);

    return {
      size: response.ContentLength || 0,
      contentType: response.ContentType || "",
      lastModified: response.LastModified || new Date(),
    };
  } catch (error) {
    console.error("Error getting file metadata:", error);
    throw new Error("خطا در دریافت اطلاعات فایل");
  }
}

/**
 * تولید URL عمومی برای فایل‌های public
 * (فقط اگر bucket شما public باشد)
 */
export function getPublicUrl(filePath: string): string {
  const endpoint = process.env.S3_PUBLIC_ENDPOINT || process.env.S3_ENDPOINT;
  return `${endpoint}/${BUCKET_NAME}/${filePath}`;
}
