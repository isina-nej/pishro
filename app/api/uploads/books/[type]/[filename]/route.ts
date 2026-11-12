import { NextRequest, NextResponse } from 'next/server';
import { access, stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { Readable } from 'stream';
import { join } from 'path';
import { constants } from 'fs';
import { BOOKS_UPLOAD_PATHS } from '@/lib/upload-config';
import { canReadPrivateBookUpload } from '@/lib/services/private-upload-access';
import {
  assertSafeStoragePath,
  getStorageConfig,
} from '@/lib/services/storage-adapter';

export async function GET(
  request: NextRequest,
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

    if (filename.includes("/") || filename.includes("\\") || filename.includes("\0")) {
      return NextResponse.json({ error: 'نام فایل نامعتبر' }, { status: 400 });
    }

    if (type !== 'covers' && !(await canReadPrivateBookUpload(request, `books/${type}/${filename}`))) {
      return NextResponse.json({ error: 'Access denied' }, {
        status: 403, headers: { 'Cache-Control': 'private, no-store' },
      });
    }

    // Get upload path based on type — assertSafeStoragePath blocks ../ escape.
    const uploadPath = BOOKS_UPLOAD_PATHS[type as keyof typeof BOOKS_UPLOAD_PATHS];
    let filePath: string;
    try {
      filePath = assertSafeStoragePath(
        getStorageConfig().storagePath,
        `books/${type}/${filename}`
      );
    } catch {
      return NextResponse.json({ error: 'نام فایل نامعتبر' }, { status: 400 });
    }
    void uploadPath;

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

    // Streaming prevents loading a 200MB book/audio object into server memory.
    const fileStat = await stat(resolvedPath);
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: 'فایل یافت نشد' }, { status: 404 });
    }

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

    return new NextResponse(Readable.toWeb(createReadStream(resolvedPath)) as ReadableStream, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileStat.size),
        'Cache-Control': type === 'covers' ? (usedFallback ? 'public, max-age=300' : 'public, max-age=31536000, immutable') : 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': 'sandbox',
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
