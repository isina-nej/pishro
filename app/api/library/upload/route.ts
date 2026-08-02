import { NextRequest, NextResponse } from 'next/server';
import { saveFileToStorage } from '@/lib/services/storage-adapter';

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

    // Determine storage prefix based on file type
    const STORAGE_PREFIXES = {
      cover: 'books/covers',
      pdf: 'books/pdfs',
      audio: 'books/audio',
    } as const;

    const prefix = STORAGE_PREFIXES[fileType as keyof typeof STORAGE_PREFIXES];

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `${fileType}_${timestamp}_${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Convert file to buffer and save (ابری یا محلی، بسته به STORAGE_DRIVER)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileUrl = await saveFileToStorage(
      buffer,
      `${prefix}/${filename}`,
      file.type
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
