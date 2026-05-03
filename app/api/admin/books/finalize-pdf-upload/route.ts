/**
 * Admin Books PDF Finalize Upload API
 * POST /api/admin/books/finalize-pdf-upload - Combine chunks and finalize PDF upload
 */

import { NextRequest, NextResponse } from "next/server";
import { readFile, rm, mkdir } from "fs/promises";
import { createWriteStream, existsSync } from "fs";
import path from "path";
import {
  successResponse,
  validationError,
  errorResponse,
} from "@/lib/api-response";

const UPLOAD_DIR = process.env.UPLOAD_BASE_DIR || "/opt/pishro_uploads";
const CHUNKS_DIR = path.join(UPLOAD_DIR, "chunks");
const BOOKS_DIR = path.join(UPLOAD_DIR, "books", "pdfs");

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
    "Access-Control-Allow-Credentials": isOriginAllowed ? "true" : "false",
  };
}

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(req) });
}

export async function POST(req: NextRequest) {
  try {
    console.log("🔗 PDF finalize request received");

    // Ensure directories exist
    if (!existsSync(BOOKS_DIR)) {
      await mkdir(BOOKS_DIR, { recursive: true });
    }

    const body = await req.json();
    const { fileId, totalChunks, fileName, fileSize } = body;

    if (!fileId || !totalChunks || !fileName) {
      return validationError(
        { finalize: "اطلاعات ناقص است" },
        "اطلاعات الزامی وجود ندارد"
      );
    }

    console.log(`📦 Combining ${totalChunks} chunks for file ${fileId}`);

    // Verify all chunks exist
    const fileChunksDir = path.join(CHUNKS_DIR, fileId);
    if (!existsSync(fileChunksDir)) {
      throw new Error("دایرکتوری تکه‌های فایل پیدا نشد");
    }

    // Combine chunks
    const finalFileName = `${fileId}_${fileName}`;
    const finalPath = path.join(BOOKS_DIR, finalFileName);
    
    const writeStream = createWriteStream(finalPath);

    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(fileChunksDir, `chunk_${i}`);
      
      if (!existsSync(chunkPath)) {
        throw new Error(`تکه ${i} پیدا نشد`);
      }

      const chunkData = await readFile(chunkPath);
      writeStream.write(chunkData);
    }

    await new Promise((resolve, reject) => {
      writeStream.end(() => resolve(null));
      writeStream.on("error", reject);
    });

    // Clean up chunks directory
    await rm(fileChunksDir, { recursive: true, force: true });

    console.log(`✅ PDF file finalized: ${finalFileName}`);

    const fileUrl = `/api/uploads/books/pdfs/${finalFileName}`;

    const response = successResponse({
      fileName: finalFileName,
      fileUrl,
      fileSize: fileSize || 0,
      mimeType: "application/pdf",
      uploadedAt: new Date().toISOString(),
    });

    // Add CORS headers
    Object.entries(corsHeaders(req)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : "خطا در اختتام آپلود";
    console.error("❌ Finalize error:", error);
    const response = errorResponse(
      errorMessage,
      "FINALIZE_ERROR",
      undefined,
      500
    );

    // Add CORS headers
    Object.entries(corsHeaders(req)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }
}
