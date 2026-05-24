import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { BOOKS_UPLOAD_PATHS } from '@/lib/upload-config';

export async function POST(request: NextRequest) {
  try {
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

    // Validate file types
    const validTypes = {
      cover: ['image/jpeg', 'image/png', 'image/webp'],
      pdf: ['application/pdf'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/ogg'],
    };

    if (!validTypes[fileType as keyof typeof validTypes].includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `فرمت فایل غیرمعتبر است برای ${fileType}` },
        { status: 400 }
      );
    }

    // Determine upload path based on file type
    let uploadDir: string;
    let urlPath: string;

    switch (fileType) {
      case 'cover':
        uploadDir = BOOKS_UPLOAD_PATHS.covers.dir;
        urlPath = BOOKS_UPLOAD_PATHS.covers.url;
        break;
      case 'pdf':
        uploadDir = BOOKS_UPLOAD_PATHS.pdfs.dir;
        urlPath = BOOKS_UPLOAD_PATHS.pdfs.url;
        break;
      case 'audio':
        uploadDir = BOOKS_UPLOAD_PATHS.audio.dir;
        urlPath = BOOKS_UPLOAD_PATHS.audio.url;
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'نوع فایل نامعتبر' },
          { status: 400 }
        );
    }

    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `${fileType}_${timestamp}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filepath = join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return file URL
    const fileUrl = `${urlPath}/${filename}`;

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
