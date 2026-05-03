// @/app/api/video/stream/[videoId]/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  ErrorCodes,
} from "@/lib/api-response";
import { verifyStreamToken } from "@/lib/services/video-token-service";
import { getVideoByVideoId } from "@/lib/services/video-service";
import { downloadFileFromStorage } from "@/lib/services/object-storage-service";

/**
 * GET /api/video/stream/[videoId]/[...path]
 * پخش ویدیو با HLS
 * مثال: /api/video/stream/abc123/index.m3u8?token=xxx
 *        /api/video/stream/abc123/segment_001.ts?token=xxx
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string; path: string[] }> }
) {
  try {
    const { videoId, path } = await params;
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    // بررسی وجود توکن
    if (!token) {
      return unauthorizedResponse("توکن الزامی است");
    }

    // اعتبارسنجی توکن
    const verification = verifyStreamToken(token, videoId);

    if (!verification.valid) {
      return unauthorizedResponse(
        verification.error || "توکن نامعتبر است"
      );
    }

    // بررسی وجود ویدیو
    const video = await getVideoByVideoId(videoId);

    if (!video) {
      return notFoundResponse("ویدیو", "ویدیو یافت نشد");
    }

    // بررسی اینکه ویدیو آماده پخش است
    if (video.processingStatus !== "READY") {
      return errorResponse(
        "ویدیو هنوز آماده پخش نیست",
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // ساخت مسیر فایل
    const fileName = path.join("/");
    const filePath = `${video.hlsSegmentsPath}/${fileName}`;

    try {
      // دانلود فایل از storage
      const fileBuffer = await downloadFileFromStorage(filePath);

      // تشخیص نوع فایل و تنظیم Content-Type
      let contentType = "application/octet-stream";

      if (fileName.endsWith(".m3u8")) {
        contentType = "application/vnd.apple.mpegurl";
      } else if (fileName.endsWith(".ts")) {
        contentType = "video/MP2T";
      } else if (fileName.endsWith(".mp4")) {
        contentType = "video/mp4";
      }

      // اگر فایل m3u8 است، باید URLهای داخل آن را modify کنیم
      // تا token را به segment URLها اضافه کنیم
      if (fileName.endsWith(".m3u8")) {
        let playlistContent = fileBuffer.toString("utf-8");

        // پیدا کردن تمام .ts و .m3u8 فایل‌ها و اضافه کردن token
        playlistContent = playlistContent.replace(
          /^((?!#).*\.(ts|m3u8))$/gm,
          (match) => {
            // اگر URL قبلاً query string دارد
            const separator = match.includes("?") ? "&" : "?";
            return `${match}${separator}token=${token}`;
          }
        );

        // برگرداندن playlist با URLهای modified
        return new NextResponse(playlistContent, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Range, Content-Type",
          },
        });
      }

      // برای فایل‌های segment (ts)، مستقیماً برگردانیم
      return new NextResponse(new Uint8Array(fileBuffer), {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": fileBuffer.length.toString(),
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Range, Content-Type",
        },
      });
    } catch (fileError) {
      console.error("Error downloading file from storage:", fileError);
      return notFoundResponse("فایل", "فایل درخواستی یافت نشد");
    }
  } catch (error) {
    console.error("[GET /api/video/stream] error:", error);
    return errorResponse(
      "خطایی در پخش ویدیو رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}

/**
 * OPTIONS /api/video/stream/[videoId]/[...path]
 * برای CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
