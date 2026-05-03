import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{
    id: string;
    type: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id, type } = await params;

    // Validate type is one of the allowed values
    if (!['pdf', 'cover', 'audio'].includes(type)) {
      return errorResponse("نوع فایل نامعتبر است", ErrorCodes.INVALID_INPUT);
    }

    console.log(`[Download] Request: id=${id}, type=${type}`);

    // Validate book exists
    const book = await prisma.digitalBook.findUnique({
      where: { id },
    });

    if (!book) {
      console.error(`[Download] Book not found: ${id}`);
      return errorResponse("کتاب یافت نشد", ErrorCodes.NOT_FOUND);
    }

    let fileUrl: string | null = null;

    // Determine which file to download
    switch (type) {
      case "pdf":
        fileUrl = book.fileUrl;
        break;
      case "cover":
        fileUrl = book.cover;
        break;
      case "audio":
        fileUrl = book.audioUrl;
        break;
      default:
        console.error(`[Download] Invalid type: ${type}`);
        return errorResponse("نوع فایل معتبر نیست", ErrorCodes.VALIDATION_ERROR);
    }

    console.log(`[Download] File URL: ${fileUrl}`);
    console.log(`[Download] Book data:`, { id, title: book.title, fileUrl, type });

    if (!fileUrl) {
      console.error(`[Download] File URL is empty for type: ${type}, Book data:`, {
        id,
        title: book.title,
        fileUrl: book.fileUrl,
        cover: book.cover,
        audioUrl: book.audioUrl,
      });
      return errorResponse(
        "این فایل برای این کتاب موجود نیست",
        ErrorCodes.NOT_FOUND
      );
    }

    // Increment downloads count
    try {
      await prisma.digitalBook.update({
        where: { id },
        data: { downloads: { increment: 1 } },
      });
      console.log(`[Download] Downloads count incremented for: ${id}`);
    } catch (updateErr) {
      console.error(`[Download] Error updating download count:`, updateErr);
    }

    // Return file content directly instead of redirecting
    console.log(`[Download] Serving file from: ${fileUrl}`);
    
    // If it's an API upload path, serve it directly
    if (fileUrl.startsWith('/api/uploads/')) {
      try {
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${fileUrl}`);
        if (!uploadResponse.ok) {
          console.error(`[Download] Upload API returned ${uploadResponse.status}`);
          return errorResponse(
            "خطا در دسترسی به فایل",
            ErrorCodes.NOT_FOUND
          );
        }
        const buffer = await uploadResponse.arrayBuffer();
        
        // تعیین نوع فایل و نام بر اساس type
        let contentType = "application/octet-stream";
        let fileName = book.slug;
        
        switch (type) {
          case "pdf":
            contentType = "application/pdf";
            fileName = `${book.slug}.pdf`;
            break;
          case "cover":
            contentType = "image/jpeg";
            fileName = `${book.slug}-cover.jpg`;
            break;
          case "audio":
            contentType = "audio/mpeg";
            fileName = `${book.slug}-audio.mp3`;
            break;
        }
        
        return new Response(buffer, {
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${fileName}"`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
      } catch (error) {
        console.error(`[Download] Error serving file:`, error);
        return errorResponse(
          "خطا در دسترسی به فایل",
          ErrorCodes.INTERNAL_ERROR
        );
      }
    }
    
    // For external URLs, redirect
    const response = new Response(null, {
      status: 302,
      headers: {
        "Location": fileUrl,
      },
    });
    return response;
    
  } catch (error) {
    console.error("[Download] General error:", error);
    return errorResponse(
      "خطایی در دانلود فایل رخ داد",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
