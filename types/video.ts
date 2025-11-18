// @/types/video.ts
import type { Video, VideoProcessingStatus } from "@prisma/client";

/**
 * تایپ پایه ویدیو از Prisma
 */
export type { Video, VideoProcessingStatus };

/**
 * تایپ برای ایجاد ویدیوی جدید
 */
export interface CreateVideoInput {
  title: string;
  description?: string;
  videoId: string; // شناسه یکتا برای ویدیو
  originalPath: string;
  fileSize: number;
  fileFormat: string;
  duration?: string;
  thumbnailPath?: string;
  width?: number;
  height?: number;
  bitrate?: number;
  codec?: string;
  frameRate?: number;
}

/**
 * تایپ برای بروزرسانی ویدیو
 */
export interface UpdateVideoInput {
  title?: string;
  description?: string;
  duration?: string;
  hlsPlaylistPath?: string;
  hlsSegmentsPath?: string;
  processingStatus?: VideoProcessingStatus;
  processingError?: string;
  thumbnailPath?: string;
  width?: number;
  height?: number;
  bitrate?: number;
  codec?: string;
  frameRate?: number;
}

/**
 * تایپ برای Signed Upload URL
 */
export interface SignedUploadUrlResponse {
  uploadUrl: string;
  videoId: string;
  expiresAt: number; // Timestamp
}

/**
 * تایپ برای درخواست Upload URL
 */
export interface RequestUploadUrlInput {
  fileName: string;
  fileSize: number;
  fileFormat: string;
  title: string;
  description?: string;
}

/**
 * تایپ برای Signed Playback URL
 */
export interface SignedPlaybackUrlResponse {
  playbackUrl: string;
  expiresAt: number; // Timestamp
}

/**
 * تایپ برای Stream Token
 */
export interface StreamToken {
  token: string;
  videoId: string;
  userId?: string;
  expiresAt: number; // Timestamp
}

/**
 * تایپ برای درخواست Stream Token
 */
export interface RequestStreamTokenInput {
  videoId: string;
}

/**
 * تایپ برای Verify Stream Token
 */
export interface VerifyStreamTokenInput {
  token: string;
  videoId: string;
}

/**
 * تایپ برای اطلاعات پردازش HLS
 */
export interface HLSProcessingOptions {
  qualities?: ("360p" | "480p" | "720p" | "1080p")[];
  segmentDuration?: number; // به ثانیه
  generateThumbnail?: boolean;
}

/**
 * تایپ برای metadata ویدیو
 */
export interface VideoMetadata {
  duration: string;
  width: number;
  height: number;
  bitrate: number;
  codec: string;
  frameRate: number;
  size: number;
}

/**
 * تایپ برای لیست ویدیوها با پیجینیشن
 */
export interface VideoListResponse {
  videos: Video[];
  total: number;
  page: number;
  limit: number;
}

/**
 * تایپ برای فیلتر ویدیوها
 */
export interface VideoFilterOptions {
  processingStatus?: VideoProcessingStatus;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * تایپ برای آپلود progress
 */
export interface UploadProgress {
  videoId: string;
  progress: number; // 0-100
  uploadedBytes: number;
  totalBytes: number;
  status: "uploading" | "processing" | "completed" | "error";
  error?: string;
}
