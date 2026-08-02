'use server';

/**
 * API Route: POST /api/news/upload-image
 * Upload image for news articles
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { randomBytes } from 'crypto';
import { saveFileToStorage } from '@/lib/services/storage-adapter';
import { checkRateLimit, getClientIp, addSecurityHeaders } from '@/lib/api-security';

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request.headers);

    // Check rate limit
    const rateLimit = checkRateLimit(clientIp, 'upload');
    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        { error: 'Too many image uploads. Please try again later.' },
        { status: 429 }
      );
      response.headers.set('Retry-After', '60');
      return addSecurityHeaders(response);
    }

    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return addSecurityHeaders(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );
    }

    // Check admin permissions
    const isAdmin =
      session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN';
    if (!isAdmin) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Only admins can upload images' },
          { status: 403 }
        )
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return addSecurityHeaders(
        NextResponse.json({ error: 'No file provided' }, { status: 400 })
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
          { status: 400 }
        )
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'File too large. Maximum size is 5MB.' },
          { status: 400 }
        )
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const timestamp = Date.now();
    const random = randomBytes(4).toString('hex');
    const filename = `${timestamp}-${random}.${ext}`;

    // ذخیره در storage (ابری یا محلی، بسته به STORAGE_DRIVER)
    const publicUrl = await saveFileToStorage(
      buffer,
      `news/${filename}`,
      file.type
    );

    const response = NextResponse.json(
      {
        url: publicUrl,
        filename,
        size: file.size,
      },
      { status: 200 }
    );
    return addSecurityHeaders(response);
  } catch (error) {
    console.error('Image upload error:', error);
    return addSecurityHeaders(
      NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      )
    );
  }
}
