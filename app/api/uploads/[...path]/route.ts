import { NextRequest, NextResponse } from 'next/server';
import { stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { extname, join } from 'path';
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
    let resolvedPath = fullPath;
    let fileStat;

    try {
      fileStat = await stat(resolvedPath);
    } catch {
      // Seed records reference generated image paths; return a real local
      // placeholder until those generated assets are uploaded.
      if (pathParam.startsWith('courses/')) {
        resolvedPath = join(process.cwd(), 'public/images/courses/placeholder.png');
      } else if (pathParam.startsWith('news/')) {
        resolvedPath = join(process.cwd(), 'public/images/news/post-1.jpg');
      } else {
        throw new Error('File not found');
      }
      fileStat = await stat(resolvedPath);
    }

    if (!fileStat.isFile()) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileStream = createReadStream(resolvedPath);
    return new NextResponse(Readable.toWeb(fileStream) as ReadableStream, {
      status: 200,
      headers: {
        'Content-Type': getMimeType(resolvedPath),
        'Content-Length': fileStat.size.toString(),
        'Cache-Control': resolvedPath === fullPath ? 'public, max-age=31536000, immutable' : 'public, max-age=300',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
