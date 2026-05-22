import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join, normalize } from 'path';
import { getStorageConfig } from '@/lib/services/storage-adapter';

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
  const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

export async function GET(req: NextRequest) {
  const storageConfig = getStorageConfig();
  const pathParam = req.nextUrl.pathname.replace(/^\/api\/uploads\/?/, '');

  if (!pathParam) {
    return NextResponse.json({ error: 'Invalid upload path' }, { status: 400 });
  }

  const normalizedRelativePath = normalize(pathParam).replace(/^\.\//, '');
  const fullPath = normalize(join(storageConfig.storagePath, normalizedRelativePath));

  if (!fullPath.startsWith(normalize(storageConfig.storagePath))) {
    return NextResponse.json({ error: 'Invalid upload path' }, { status: 400 });
  }

  try {
    const fileStat = await stat(fullPath);
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = await readFile(fullPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': getMimeType(fullPath),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
