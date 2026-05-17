import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { prisma } from "@/lib/prisma";
import { errorResponse, ErrorCodes } from "@/lib/api-response";
import {
  generateSignedDownloadUrl,
  downloadFileFromStorage,
} from "@/lib/services/object-storage-service";
import { getAbsoluteStoragePath } from "@/lib/services/storage-adapter";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { resolveLessonVideoRelativePath } from "@/lib/services/lesson-service";

const STREAM_EXPIRES = 60;

/**
 * GET /api/admin/lessons/[id]/stream
 * Proxied stream — storage URL never sent to client
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

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        video: { select: { originalPath: true, fileFormat: true } },
      },
    });

    if (!lesson) {
      return errorResponse("درس یافت نشد", ErrorCodes.NOT_FOUND);
    }

    const relativePath = resolveLessonVideoRelativePath(lesson);
    if (!relativePath) {
      return errorResponse(
        "ویدیویی برای این درس یافت نشد",
        ErrorCodes.NOT_FOUND
      );
    }

    let fileContent: Buffer;
    const useS3 = !!process.env.S3_BUCKET_NAME;

    if (useS3) {
      try {
        const signedUrl = await generateSignedDownloadUrl(
          relativePath,
          STREAM_EXPIRES
        );
        const fetchRes = await fetch(signedUrl);
        if (!fetchRes.ok) {
          console.error("[Stream] signed fetch failed:", fetchRes.status);
          return errorResponse(
            "خطا در دریافت ویدیو",
            ErrorCodes.INTERNAL_ERROR,
            undefined,
            500
          );
        }
        fileContent = Buffer.from(await fetchRes.arrayBuffer());
      } catch (err) {
        console.error("[Stream] signed URL generation/fetch failed:", err);
        return errorResponse(
          "خطا در تولید لینک پخش",
          ErrorCodes.INTERNAL_ERROR,
          undefined,
          500
        );
      }
    } else {
      const absolutePath = getAbsoluteStoragePath(relativePath);
      if (!existsSync(absolutePath)) {
        try {
          fileContent = await downloadFileFromStorage(relativePath);
        } catch {
          console.error(`[Stream] file not found: ${absolutePath}`);
          return errorResponse(
            "فایل ویدیو یافت نشد",
            ErrorCodes.NOT_FOUND
          );
        }
      } else {
        try {
          fileContent = await readFile(absolutePath);
        } catch (err) {
          console.error(`[Stream] read failed: ${absolutePath}`, err);
          return errorResponse(
            "خطا در خواندن فایل ویدیو",
            ErrorCodes.INTERNAL_ERROR,
            undefined,
            500
          );
        }
      }
    }

    const response = new NextResponse(new Uint8Array(fileContent));
    response.headers.set("Content-Type", "video/mp4");
    response.headers.set("Content-Length", fileContent.length.toString());
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Accept-Ranges", "bytes");

    return response;
  } catch (error) {
    console.error("[GET /api/admin/lessons/[id]/stream] error:", error);
    return errorResponse(
      "خطا در پخش ویدیو",
      ErrorCodes.INTERNAL_ERROR,
      undefined,
      500
    );
  }
}
