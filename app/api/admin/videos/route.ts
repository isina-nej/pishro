// @/app/api/admin/videos/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  successResponse,
  errorResponse,
  validationError,
  paginatedResponse,
  ErrorCodes
} from "@/lib/api-response";
  createVideo,
  getVideos,
  getVideosCountByStatus
} from "@/lib/services/video-service";
import { processVideoToHLS } from "@/lib/services/hls-transcoding-service";
import type {
  CreateVideoInput,
  VideoFilterOptions,
  VideoProcessingStatus
} from "@/types/video";

/**
 * GET /api/admin/videos
 * دریافت لیست ویدیوها (با فیلتر و pagination)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return errorResponse("دسترسی غیرمجاز - فقط ادمین", ErrorCodes.UNAUTHORIZED);
    }
    const searchParams = req.nextUrl.searchParams;
    const statusParam = searchParams.get("status");
    const options: VideoFilterOptions = {
      processingStatus: statusParam as VideoProcessingStatus | undefined,
      search: searchParams.get("search") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20")
    };
    const { videos, total, page, limit } = await getVideos(options);
    // دریافت آمار کلی
    const _stats = await getVideosCountByStatus();
    return paginatedResponse(
      videos,
      page,
      limit,
      total,
      "ویدیوها با موفقیت دریافت شدند"
    );
  } catch (error) {
    console.error("[GET /api/admin/videos] error:", error);
    return errorResponse(
      "خطایی در دریافت ویدیوها رخ داد",
      ErrorCodes.DATABASE_ERROR
  }
}
 * POST /api/admin/videos
 * ایجاد ویدیوی جدید و شروع پردازش HLS
export async function POST(req: NextRequest) {
    const body = await req.json();
    const {
      title,
      description,
      videoId,
      originalPath,
      fileSize,
      fileFormat,
      duration,
      width,
      height,
      bitrate,
      codec,
      frameRate,
      startProcessing = true, // آیا بلافاصله پردازش شروع شود؟
    } = body;
    // Validation
    if (!title || !videoId || !originalPath || !fileSize || !fileFormat) {
      return validationError({
        title: !title ? "عنوان الزامی است" : "",
        videoId: !videoId ? "شناسه ویدیو الزامی است" : "",
        originalPath: !originalPath ? "مسیر فایل الزامی است" : "",
        fileSize: !fileSize ? "حجم فایل الزامی است" : "",
        fileFormat: !fileFormat ? "فرمت فایل الزامی است" : ""
      });
    const videoData: CreateVideoInput = {
      frameRate
    // ایجاد رکورد ویدیو در دیتابیس
    const video = await createVideo(videoData);
    // شروع پردازش HLS در background (non-blocking)
    if (startProcessing) {
      processVideoToHLS(videoId, originalPath, {
        qualities: ["360p", "720p"],
        segmentDuration: 6,
        generateThumbnail: true
      }).catch((error) => {
        console.error("Background HLS processing error:", error);
    return successResponse(
      video,
      "ویدیو با موفقیت ایجاد شد و پردازش آن شروع شد"
    console.error("[POST /api/admin/videos] error:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
        videoId: "این شناسه ویدیو قبلاً استفاده شده است"
      "خطایی در ایجاد ویدیو رخ داد",
