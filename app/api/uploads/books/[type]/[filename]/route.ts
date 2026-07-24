import { NextRequest, NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';
import { BOOKS_UPLOAD_PATHS } from '@/lib/upload-config';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string; filename: string }> }
) {
  try {
    const { type, filename } = await params;

    // Validate file type
    if (!['covers', 'pdfs', 'audio'].includes(type)) {
      return NextResponse.json(
        { error: 'نوع فایل نامعتبر' },
        { status: 400 }
      );
    }

    // Get upload path based on type
    const uploadPath = BOOKS_UPLOAD_PATHS[type as keyof typeof BOOKS_UPLOAD_PATHS];
    const filePath = join(uploadPath.dir, filename);

    let resolvedPath = filePath;
    let usedFallback = false;

    try {
      await access(resolvedPath, constants.F_OK);
    } catch {
      if (type !== 'covers') {
        return NextResponse.json({ error: 'فایل یافت نشد' }, { status: 404 });
      }
      resolvedPath = join(process.cwd(), 'public/images/library/landing.jpg');
      usedFallback = true;
    }

    const fileContent = await readFile(resolvedPath);

    // Determine content type based on file type
    let contentType = 'application/octet-stream';
    if (type === 'covers') {
      const ext = filename.toLowerCase().split('.').pop();
      if (ext === 'png') contentType = 'image/png';
      else if (ext === 'webp') contentType = 'image/webp';
      else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    } else if (type === 'pdfs') {
      contentType = 'application/pdf';
    } else if (type === 'audio') {
      const ext = filename.toLowerCase().split('.').pop();
      if (ext === 'mp3') contentType = 'audio/mpeg';
      else if (ext === 'wav') contentType = 'audio/wav';
      else if (ext === 'm4a') contentType = 'audio/m4a';
      else if (ext === 'ogg') contentType = 'audio/ogg';
    }

    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': usedFallback ? 'public, max-age=300' : 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('File serving error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت فایل' },
      { status: 500 }
    );
  }
}
