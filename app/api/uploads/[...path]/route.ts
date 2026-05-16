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

    const mimeType = detectMimeType(fileBuffer, filePath);

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

function detectMimeType(buffer: Buffer, filePath: string): string {
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return "image/png";
  }

  if (buffer.length >= 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return "image/jpeg";
  }

  if (buffer.length >= 4 && buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
    return "image/webp";
  }

  if (buffer.length >= 3 && buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return "image/gif";
  }

  if (buffer.length >= 4 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return "application/pdf";
  }

  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "pdf":
      return "application/pdf";
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "m4a":
      return "audio/mp4";
    default:
      return "application/octet-stream";
  }
}
