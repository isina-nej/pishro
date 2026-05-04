/**
 * Admin Books PDF Chunked Upload API
 * POST /api/admin/books/upload-pdf-chunk - Upload a chunk of a PDF file
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import {
  successResponse,
  validationError,
  errorResponse
} from "@/lib/api-response";

const UPLOAD_DIR = process.env.UPLOAD_BASE_DIR || "/opt/pishro_uploads";
const CHUNKS_DIR = path.join(UPLOAD_DIR, "chunks");

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
    const session = await auth();
    console.log("📦 PDF chunk upload request received");

    // Ensure chunks directory exists
    if (!existsSync(CHUNKS_DIR)) {
      await mkdir(CHUNKS_DIR, { recursive: true });
    }

    const formData = await req.formData();
    const chunk = formData.get("chunk") as File | null;
    const chunkIndex = formData.get("chunkIndex") as string;
    const totalChunks = formData.get("totalChunks") as string;
    const fileId = formData.get("fileId") as string;

    if (!chunk || !chunkIndex || !totalChunks || !fileId) {
      return validationError(
        { chunk: "تکه فایل و اطلاعات مورد نیاز است" },
        "اطلاعات ناقص است"
      );
    }

    // Create a directory for this file's chunks
    const fileChunksDir = path.join(CHUNKS_DIR, fileId);
    if (!existsSync(fileChunksDir)) {
      await mkdir(fileChunksDir, { recursive: true });
    }

    // Save the chunk
    const chunkPath = path.join(fileChunksDir, `chunk_${chunkIndex}`);
    const bytes = await chunk.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(chunkPath, buffer);

    console.log(
      `✅ Chunk ${chunkIndex}/${totalChunks} uploaded for file ${fileId}`
    );

    const response = successResponse({
      chunkIndex: parseInt(chunkIndex),
      totalChunks: parseInt(totalChunks),
      fileId,
      status: "chunk_received"
    });

    // Add CORS headers
    Object.entries(corsHeaders(req)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : "خطا در آپلود تکه";
    console.error("❌ Chunk upload error:", error);
    const response = errorResponse(
      errorMessage,
      "CHUNK_UPLOAD_ERROR",
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
