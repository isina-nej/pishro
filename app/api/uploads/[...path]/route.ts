import { NextRequest, NextResponse } from 'next/server';
import { stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { extname } from 'path';
import { Readable } from 'stream';
import { assertSafeStoragePath, getStorageConfig } from '@/lib/services/storage-adapter';

export const runtime = 'nodejs';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.html': 'text/html',
};

function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function isProtectedCourseVideoPath(pathParam: string): boolean {
  const normalized = pathParam.replace(/\\/g, '/').replace(/^\/+/, '');
  return /^courses\/[^/]+\/lessons\/[^/]+\/video\/.+\.(mp4|webm)$/i.test(normalized);
}

export async function GET(req: NextRequest) {
  const storageConfig = getStorageConfig();
  const pathParam = decodeURIComponent(req.nextUrl.pathname.replace(/^\/api\/uploads\/?/, ''));

  if (!pathParam) {
    return NextResponse.json({ error: 'Invalid upload path' }, { status: 400 });
  }

  if (isProtectedCourseVideoPath(pathParam)) {
    return NextResponse.json(
      { error: 'Protected video files must be streamed through the lesson player' },
      {
        status: 403,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      }
    );
  }

  let fullPath: string;
  try {
    fullPath = assertSafeStoragePath(storageConfig.storagePath, pathParam);
  } catch {
    return NextResponse.json({ error: 'Invalid upload path' }, { status: 400 });
  }

  try {
    const fileStat = await stat(fullPath);
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileStream = createReadStream(fullPath);
    return new NextResponse(Readable.toWeb(fileStream) as ReadableStream, {
      status: 200,
      headers: {
        'Content-Type': getMimeType(fullPath),
        'Content-Length': fileStat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
