/**
 * Admin Books PDF Upload API
 * POST /api/admin/books/upload-pdf - Upload a PDF file for a digital book
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile } from "fs/promises";
import {
  successResponse,
  validationError,
  errorResponse,
  ErrorCodes
} from "@/lib/api-response";
  BOOKS_UPLOAD_PATHS,
  ensureUploadDirExists,
  generateFileUrl
} from "@/lib/upload-config";
// تنظیمات مجاز برای آپلود PDF کتاب
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
const ALLOWED_TYPES = ["application/pdf"];
const ALLOWED_EXTENSIONS = ["pdf"];
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
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    // Note: Auth is handled by the admin panel - this endpoint receives already-authenticated requests
    const formData = await req.formData();
    const file = formData.get("pdf") as File | null;
    console.log("PDF upload request received:", { fileName: file?.name, fileSize: file?.size });
    if (!file) {
      return validationError(
        { pdf: "فایل PDF الزامی است" },
        "فایل PDF الزامی است"
      );
    }
    // بررسی نوع فایل
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.error("Invalid file type:", file.type);
        { pdf: "فقط فایل‌های PDF مجاز هستند" },
        "فقط فرمت PDF مجاز است"
    // بررسی حجم فایل
    if (file.size > MAX_FILE_SIZE) {
      console.error("File too large:", file.size);
        { pdf: "حجم فایل نباید بیشتر از 100 مگابایت باشد" },
        "حجم فایل نباید بیشتر از 100 مگابایت باشد"
    // بررسی پسوند فایل
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      console.error("Invalid file extension:", extension);
        { pdf: "پسوند فایل معتبر نیست" },
        "پسوند فایل باید .pdf باشد"
    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // ایجاد نام منحصر به فرد برای فایل
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `book_${timestamp}_${randomString}.pdf`;
    // مسیر ذخیره فایل
    const uploadDir = BOOKS_UPLOAD_PATHS.pdfs.dir;
    const filepath = `${uploadDir}/${filename}`.replace(/\\/g, "/");
    console.log("Creating upload directory:", uploadDir);
    // ایجاد دایرکتوری اگر وجود ندارد
    try {
      await ensureUploadDirExists(uploadDir);
      console.log("Upload directory created successfully");
    } catch (err) {
      console.error("Error creating directory:", err);
      throw err;
    console.log("Writing file to disk:", filepath);
    // ذخیره فایل
      await writeFile(filepath, buffer);
      console.log("File written successfully");
      console.error("Error writing file:", err);
    // URL نسبی فایل
    const pdfUrl = generateFileUrl("pdf", filename);
    console.log("Upload successful:", { pdfUrl, fileName: file.name });
    const response = successResponse(
      {
        fileName: file.name,
        fileUrl: pdfUrl,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString()
      },
      "فایل PDF با موفقیت آپلود شد"
    );
    
    // Add CORS headers to response
    for (const [key, value] of Object.entries(corsHeaders(req))) {
      response.headers.set(key, value);
    return response;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    const response = errorResponse(
      "خطا در آپلود فایل PDF: " + (error instanceof Error ? error.message : String(error)),
      ErrorCodes.INTERNAL_ERROR
    // Add CORS headers to error response
  }
