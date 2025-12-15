// @/lib/services/video-service.ts
import { prisma } from "@/lib/prisma";
import type {
  Video,
  VideoProcessingStatus,
  Prisma,
} from "@prisma/client";
import type {
  CreateVideoInput,
  UpdateVideoInput,
  VideoFilterOptions,
} from "@/types/video";
import {
  deleteFileFromStorage,
} from "./object-storage-service";

/**
 * ایجاد ویدیوی جدید
 */
export async function createVideo(
  data: CreateVideoInput
): Promise<Video> {
  try {
    const video = await prisma.video.create({
      data: {
        title: data.title,
        description: data.description,
        videoId: data.videoId,
        originalPath: data.originalPath,
        fileSize: data.fileSize,
        fileFormat: data.fileFormat,
        duration: data.duration,
        thumbnailPath: data.thumbnailPath,
        width: data.width,
        height: data.height,
        bitrate: data.bitrate,
        codec: data.codec,
        frameRate: data.frameRate,
        processingStatus: "UPLOADED",
      },
    });

    return video;
  } catch (error) {
    console.error("Error creating video:", error);
    throw new Error("خطا در ایجاد ویدیو");
  }
}

/**
 * بروزرسانی ویدیو
 */
export async function updateVideo(
  videoId: string,
  data: UpdateVideoInput
): Promise<Video> {
  try {
    const video = await prisma.video.update({
      where: { videoId },
      data,
    });

    return video;
  } catch (error) {
    console.error("Error updating video:", error);
    throw new Error("خطا در بروزرسانی ویدیو");
  }
}

/**
 * بروزرسانی وضعیت پردازش ویدیو
 */
export async function updateVideoProcessingStatus(
  videoId: string,
  status: VideoProcessingStatus,
  error?: string
): Promise<Video> {
  try {
    const video = await prisma.video.update({
      where: { videoId },
      data: {
        processingStatus: status,
        processingError: error,
      },
    });

    return video;
  } catch (error) {
    console.error("Error updating video processing status:", error);
    throw new Error("خطا در بروزرسانی وضعیت پردازش");
  }
}

/**
 * بروزرسانی اطلاعات HLS ویدیو
 */
export async function updateVideoHLS(
  videoId: string,
  hlsPlaylistPath: string,
  hlsSegmentsPath: string
): Promise<Video> {
  try {
    const video = await prisma.video.update({
      where: { videoId },
      data: {
        hlsPlaylistPath,
        hlsSegmentsPath,
        processingStatus: "READY",
      },
    });

    return video;
  } catch (error) {
    console.error("Error updating video HLS info:", error);
    throw new Error("خطا در بروزرسانی اطلاعات HLS");
  }
}

/**
 * دریافت ویدیو با videoId
 */
export async function getVideoByVideoId(
  videoId: string
): Promise<Video | null> {
  try {
    const video = await prisma.video.findUnique({
      where: { videoId },
    });

    return video;
  } catch (error) {
    console.error("Error fetching video:", error);
    return null;
  }
}

/**
 * دریافت ویدیو با database id
 */
export async function getVideoById(id: string): Promise<Video | null> {
  try {
    const video = await prisma.video.findUnique({
      where: { id },
    });

    return video;
  } catch (error) {
    console.error("Error fetching video by id:", error);
    return null;
  }
}

/**
 * دریافت همه ویدیوها با فیلتر و pagination
 */
export async function getVideos(
  options: VideoFilterOptions = {}
): Promise<{
  videos: Video[];
  total: number;
  page: number;
  limit: number;
}> {
  try {
    const {
      processingStatus,
      search,
      page = 1,
      limit = 20,
    } = options;

    const skip = (page - 1) * limit;

    // ساخت فیلترها
    const where: Prisma.VideoWhereInput = {};

    if (processingStatus) {
      where.processingStatus = processingStatus;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // دریافت ویدیوها
    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.video.count({ where }),
    ]);

    return {
      videos,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching videos:", error);
    return {
      videos: [],
      total: 0,
      page: 1,
      limit: 20,
    };
  }
}

/**
 * حذف ویدیو
 * همچنین فایل‌های مرتبط را از object storage حذف می‌کند
 */
export async function deleteVideo(videoId: string): Promise<void> {
  try {
    // ابتدا ویدیو را از دیتابیس می‌گیریم
    const video = await getVideoByVideoId(videoId);

    if (!video) {
      throw new Error("ویدیو یافت نشد");
    }

    // حذف ویدیو از دیتابیس
    await prisma.video.delete({
      where: { videoId },
    });

    // حذف فایل اصلی از storage (در background)
    deleteFileFromStorage(video.originalPath).catch((err) => {
      console.error("Error deleting original file:", err);
    });

    // حذف فایل‌های HLS اگر وجود دارند (در background)
    if (video.hlsPlaylistPath && video.hlsSegmentsPath) {
      // اینجا باید تمام فایل‌های داخل پوشه HLS را حذف کنیم
      // این کار می‌تواند پیچیده‌تر باشد و نیاز به listObjects دارد
      // فعلاً فقط playlist را حذف می‌کنیم
      deleteFileFromStorage(video.hlsPlaylistPath).catch((err) => {
        console.error("Error deleting HLS playlist:", err);
      });
    }

    // حذف thumbnail اگر وجود دارد (در background)
    if (video.thumbnailPath) {
      deleteFileFromStorage(video.thumbnailPath).catch((err) => {
        console.error("Error deleting thumbnail:", err);
      });
    }
  } catch (error) {
    console.error("Error deleting video:", error);
    throw new Error("خطا در حذف ویدیو");
  }
}

/**
 * دریافت تعداد ویدیوها بر اساس وضعیت
 */
export async function getVideosCountByStatus(): Promise<
  Record<VideoProcessingStatus, number>
> {
  try {
    const statuses: VideoProcessingStatus[] = [
      "UPLOADING",
      "UPLOADED",
      "PROCESSING",
      "READY",
      "FAILED",
    ];

    const counts = await Promise.all(
      statuses.map((status) =>
        prisma.video.count({ where: { processingStatus: status } })
      )
    );

    const result: Record<VideoProcessingStatus, number> = {
      UPLOADING: 0,
      UPLOADED: 0,
      PROCESSING: 0,
      READY: 0,
      FAILED: 0,
    };

    statuses.forEach((status, index) => {
      result[status] = counts[index];
    });

    return result;
  } catch (error) {
    console.error("Error fetching videos count by status:", error);
    return {
      UPLOADING: 0,
      UPLOADED: 0,
      PROCESSING: 0,
      READY: 0,
      FAILED: 0,
    };
  }
}

/**
 * دریافت ویدیوهایی که آماده پردازش هستند
 */
export async function getVideosReadyForProcessing(): Promise<Video[]> {
  try {
    const videos = await prisma.video.findMany({
      where: {
        processingStatus: "UPLOADED",
      },
      orderBy: { createdAt: "asc" },
      take: 10, // فقط 10 ویدیوی اول
    });

    return videos;
  } catch (error) {
    console.error("Error fetching videos ready for processing:", error);
    return [];
  }
}

/**
 * اتصال ویدیو به درس
 */
export async function attachVideoToLesson(
  videoId: string,
  lessonId: string
): Promise<void> {
  try {
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { videoId },
    });
  } catch (error) {
    console.error("Error attaching video to lesson:", error);
    throw new Error("خطا در اتصال ویدیو به درس");
  }
}

/**
 * دریافت ویدیوی مرتبط با یک درس
 */
export async function getVideoByLessonId(
  lessonId: string
): Promise<Video | null> {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { video: true },
    });

    return lesson?.video || null;
  } catch (error) {
    console.error("Error fetching video by lesson:", error);
    return null;
  }
}

/**
 * دریافت آمار کامل ویدیوها برای ادمین
 */
export async function getVideoStats(): Promise<{
  totalVideos: number;
  totalSize: number;
  totalDuration: number;
  byStatus: Record<VideoProcessingStatus, number>;
  recentVideos: Video[];
}> {
  try {
    // تعداد کل ویدیوها
    const totalVideos = await prisma.video.count();

    // مجموع حجم فایل‌ها
    const aggregations = await prisma.video.aggregate({
      _sum: {
        fileSize: true,
      },
    });

    // تعداد بر اساس وضعیت
    const byStatus = await getVideosCountByStatus();

    // آخرین ویدیوها
    const recentVideos = await prisma.video.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        videoId: true,
        title: true,
        description: true,
        processingStatus: true,
        fileSize: true,
        duration: true,
        thumbnailPath: true,
        createdAt: true,
      },
    });

    return {
      totalVideos,
      totalSize: aggregations._sum?.fileSize || 0,
      totalDuration: 0, // Duration is a string field, cannot be aggregated
      byStatus,
      recentVideos: recentVideos as Video[],
    };
  } catch (error) {
    console.error("Error fetching video stats:", error);
    return {
      totalVideos: 0,
      totalSize: 0,
      totalDuration: 0,
      byStatus: {
        UPLOADING: 0,
        UPLOADED: 0,
        PROCESSING: 0,
        READY: 0,
        FAILED: 0,
      },
      recentVideos: [],
    };
  }
}
