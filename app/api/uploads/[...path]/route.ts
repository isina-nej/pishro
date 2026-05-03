import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { existsSync } from "fs";

// Serve uploaded files from the centralized upload directory
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const filePath = path.join("/");

    console.log("Upload serve request:", { path, filePath, UPLOAD_BASE_DIR: process.env.UPLOAD_BASE_DIR });

    // Security: prevent directory traversal
    if (filePath.includes("..") || filePath.startsWith("/")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Path to the centralized uploads directory
    let uploadBaseDir = process.env.UPLOAD_BASE_DIR || join("D:", "pishro_uploads");
    uploadBaseDir = resolve(uploadBaseDir);
    
    console.log("Resolved upload base dir:", uploadBaseDir);
    
    const fullPath = join(uploadBaseDir, filePath);
    
    console.log("Full file path:", fullPath);

    // Verify the file exists and is within the uploads directory
    if (!fullPath.startsWith(uploadBaseDir)) {
      console.warn(`Security: attempted path traversal: ${fullPath}`);
      return new NextResponse("Not Found", { status: 404 });
    }

    let actualPath = fullPath;
    
    if (!existsSync(actualPath)) {
      console.log(`File not found at primary path: ${actualPath}`);
      
      // Fallback: try /pdfs subdirectory for book PDFs
      if (filePath.startsWith("books/") && filePath.endsWith(".pdf")) {
        const fallbackPath = join(uploadBaseDir, "books", "pdfs", filePath.replace("books/", ""));
        console.log(`Trying fallback path: ${fallbackPath}`);
        
        if (existsSync(fallbackPath)) {
          actualPath = fallbackPath;
          console.log(`Using fallback path: ${fallbackPath}`);
        } else {
          console.warn(`File not found at primary: ${fullPath} or fallback: ${fallbackPath}`);
          return new NextResponse("Not Found", { status: 404 });
        }
      } else {
        console.warn(`File not found: ${fullPath}`);
        return new NextResponse("Not Found", { status: 404 });
      }
    }

    // Read and serve the file
    const fileBuffer = await readFile(actualPath);
    console.log(`Serving file: ${actualPath}, size: ${fileBuffer.length} bytes`);

    // Determine MIME type based on file extension
    const ext = filePath.split(".").pop()?.toLowerCase();
    let mimeType = "application/octet-stream";

    switch (ext) {
      case "jpg":
      case "jpeg":
        mimeType = "image/jpeg";
        break;
      case "png":
        mimeType = "image/png";
        break;
      case "webp":
        mimeType = "image/webp";
        break;
      case "gif":
        mimeType = "image/gif";
        break;
      case "pdf":
        mimeType = "application/pdf";
        break;
      case "mp3":
        mimeType = "audio/mpeg";
        break;
      case "wav":
        mimeType = "audio/wav";
        break;
      case "m4a":
        mimeType = "audio/mp4";
        break;
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("File serving error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
