import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/auth-simple';
import { errorResponse, ErrorCodes, HttpStatus } from '@/lib/api-response';
import { saveFileToStorage } from '@/lib/services/storage-adapter';
import { randomSlug, sniffUpload } from '@/lib/upload-validation';

export async function POST(request: NextRequest) {
  try {
    // این مسیر زیر ماژور /api/admin نیست، پس middleware آن را محافظت نمی‌کند
    // و باید احراز هویت ادمین صراحتاً اینجا بررسی شود (مثل app/api/admin/books/upload-*)
    const adminAuth = await getAdminAuth(request);
    if (!adminAuth) {
      return errorResponse(
        'دسترسی غیرمجاز',
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string; // 'cover', 'pdf', 'audio'

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'فایلی انتخاب نشد' },
        { status: 400 }
      );
    }

    if (!fileType || !['cover', 'pdf', 'audio'].includes(fileType)) {
      return NextResponse.json(
        { success: false, message: 'نوع فایل نامعتبر است' },
        { status: 400 }
      );
    }

    // File size limits
    const MAX_SIZES = {
      cover: 5 * 1024 * 1024, // 5MB
      pdf: 100 * 1024 * 1024, // 100MB
      audio: 200 * 1024 * 1024, // 200MB
    };

    if (file.size > MAX_SIZES[fileType as keyof typeof MAX_SIZES]) {
      return NextResponse.json(
        {
          success: false,
          message: `حجم فایل بیش از حد مجاز است (حداکثر ${MAX_SIZES[fileType as keyof typeof MAX_SIZES] / (1024 * 1024)}MB)`
        },
        { status: 400 }
      );
    }

    // Convert file to buffer and sniff magic bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const sniffKind = fileType === 'cover' ? 'image' : fileType === 'pdf' ? 'pdf' : 'audio';
    const detected = sniffUpload(buffer, [sniffKind]);
    if (!detected) {
      return NextResponse.json(
        { success: false, message: `فرمت فایل غیرمعتبر است برای ${fileType}` },
        { status: 400 }
      );
    }

    // Determine storage prefix based on file type
    const STORAGE_PREFIXES = {
      cover: 'books/covers',
      pdf: 'books/pdfs',
      audio: 'books/audio',
    } as const;

    const prefix = STORAGE_PREFIXES[fileType as keyof typeof STORAGE_PREFIXES];

    // Generate unique filename — ext/mime from magic bytes, never client.
    const timestamp = Date.now();
    const fileExtension = detected.ext;
    const filename = `${fileType}_${timestamp}_${await randomSlug(4)}.${fileExtension}`;

    const fileUrl = await saveFileToStorage(
      buffer,
      `${prefix}/${filename}`,
      detected.mime
    );

    return NextResponse.json({
      success: true,
      message: 'فایل با موفقیت بارگذاری شد',
      url: fileUrl,
      filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'خطا در بارگذاری فایل'
      },
      { status: 500 }
    );
  }
}
