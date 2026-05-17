// @/app/api/admin/lessons/[id]/stream/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";
import { errorResponse, ErrorCodes } from "@/lib/api-response";
import { readFile } from "fs/promises";
import { join } from "path";

/**
 * GET /api/admin/lessons/[id]/stream
 * Stream video file for a lesson (secure endpoint)
 * The actual file path is never exposed to the client
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }

    const { id: lessonId } = await params;

    // Get lesson with video
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        video: {
          select: {
            originalPath: true,
            fileFormat: true,
          },
        },
      },
    });

    if (!lesson) {
      return errorResponse("درس یافت نشد", ErrorCodes.NOT_FOUND);
    }

    // Get video path (prefer video relation, fallback to legacy videoUrl)
    let filePath: string | null = null;
    let mimeType = "video/mp4";

    if (lesson.video?.originalPath) {
      filePath = lesson.video.originalPath;
      // Determine MIME type from fileFormat
      const format = lesson.video.fileFormat?.toLowerCase();
      const mimeTypes: Record<string, string> = {
        mp4: "video/mp4",
        mov: "video/quicktime",
        avi: "video/x-msvideo",
        mkv: "video/x-matroska",
        webm: "video/webm",
      };
      mimeType = mimeTypes[format || "mp4"] || "video/mp4";
    } else if (lesson.videoUrl) {
      // Legacy: if videoUrl is an absolute path, use it; otherwise, construct path
      if (lesson.videoUrl.startsWith("/")) {
        filePath = join(
          process.env.UPLOAD_BASE_DIR || "D:/pishro_uploads",
          lesson.videoUrl
        );
      } else {
        filePath = lesson.videoUrl;
      }
    }

    if (!filePath) {
      return errorResponse(
        "ویدیویی برای این درس یافت نشد",
        ErrorCodes.NOT_FOUND
      );
    }

    // Read file from disk
    let fileContent: Buffer;
    try {
      fileContent = await readFile(filePath);
    } catch (err) {
      console.error(`[Stream] Failed to read file: ${filePath}`, err);
      return errorResponse(
        "خطا در خواندن فایل ویدیو",
        ErrorCodes.SERVER_ERROR,
        undefined,
        500
      );
    }

    // Create response with streaming
    const response = new NextResponse(fileContent);
    response.headers.set("Content-Type", mimeType);
    response.headers.set("Content-Length", fileContent.length.toString());
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Accept-Ranges", "bytes");

    return response;
  } catch (error) {
    console.error("[GET /api/admin/lessons/[id]/stream] error:", error);
    return errorResponse(
      "خطا در پخش ویدیو",
      ErrorCodes.SERVER_ERROR,
      undefined,
      500
    );
  }
}
