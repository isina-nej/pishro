import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes
} from "@/lib/api-response";
import { saveFileToStorage } from "@/lib/services/storage-adapter";

// تنظیمات برای آپلود صوت کتاب
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  "audio/aac",
  "audio/m4a",
];

// CORS headers
function corsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "https://admin.pishrosarmaye.com",
    "https://www.pishrosarmaye.com",
    "https://pishrosarmaye.com",
  ];
  
  const isOriginAllowed = allowedOrigins.includes(origin);
  
  return {
    "Access-Control-Allow-Origin": isOriginAllowed ? origin : "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": isOriginAllowed ? "true" : "false"
  };
}

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(req) });
}

export async function POST(req: NextRequest) {
  try {
    const adminAuth = await getAdminAuth(req);
    if (!adminAuth) {
      return errorResponse("دسترسی غیرمجاز", ErrorCodes.UNAUTHORIZED);
    }
    const formData = await req.formData();
    const file = formData.get("audio") as File | null;

    if (!file) {
      return validationError(
        { audio: "فایل صوتی الزامی است" },
        "فایل صوتی الزامی است"
      );
    }

    // بررسی نوع فایل
    if (!ALLOWED_TYPES.includes(file.type)) {
      return validationError(
        { audio: "فقط فایل‌های صوتی مجاز هستند" },
        "فرمت‌های مجاز: MP3, WAV, OGG, WebM, AAC, M4A"
      );
    }

    // بررسی حجم فایل
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        { audio: "حجم فایل نباید بیشتر از 500 مگابایت باشد" },
        "حجم فایل نباید بیشتر از 500 مگابایت باشد"
      );
    }

    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ایجاد نام منحصر به فرد برای فایل
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop() || "mp3";
    const filename = `audio_${timestamp}_${randomString}.${extension}`;

    // ذخیره در storage (ابری یا محلی، بسته به STORAGE_DRIVER)
    const audioUrl = await saveFileToStorage(
      buffer,
      `books/audio/${filename}`,
      file.type
    );

    const response = successResponse(
      {
        fileName: filename,
        fileUrl: audioUrl,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString()
      },
      "فایل صوتی با موفقیت آپلود شد"
    );
    
    // Add CORS headers to response
    for (const [key, value] of Object.entries(corsHeaders(req))) {
      response.headers.set(key, value);
    }
    return response;
  } catch (error) {
    console.error("Audio upload error:", error);
    const response = errorResponse(
      "خطایی در آپلود فایل صوتی رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
    
    // Add CORS headers to error response
    for (const [key, value] of Object.entries(corsHeaders(req))) {
      response.headers.set(key, value);
    }
    return response;
  }
}
