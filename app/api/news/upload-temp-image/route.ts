import { NextRequest } from 'next/server';
import { verifyAdminAccessToken } from '@/lib/admin-auth';
import { errorResponse, successResponse, ErrorCodes } from '@/lib/api-response';
import { saveTempFileToStorage } from '@/lib/services/storage-adapter';

/**
 * POST /api/news/upload-temp-image
 * Upload temporary image for news editor
 * Returns: { url: string } - The image URL to use in editor
 */
export async function POST(req: NextRequest) {
  try {
    console.log('[POST /api/news/upload-temp-image] Starting');

    // Verify admin access token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('[POST /api/news/upload-temp-image] Missing auth header');
      return errorResponse('لطفا وارد شوید', ErrorCodes.UNAUTHORIZED);
    }

    const token = authHeader.slice(7);
    const adminUser = verifyAdminAccessToken(token);

    if (!adminUser) {
      console.log('[POST /api/news/upload-temp-image] Invalid token');
      return errorResponse('توکن معتبر نیست', ErrorCodes.UNAUTHORIZED);
    }

    console.log('[POST /api/news/upload-temp-image] Auth verified');

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file');

    console.log('[POST /api/news/upload-temp-image] File:', file instanceof File ? file.name : 'Not a file');

    if (!(file instanceof File)) {
      console.log('[POST /api/news/upload-temp-image] Invalid file');
      return errorResponse('فایل الزامی است', ErrorCodes.VALIDATION_ERROR);
    }

    // Validate image type
    if (!file.type.startsWith('image/')) {
      console.log('[POST /api/news/upload-temp-image] Invalid file type:', file.type);
      return errorResponse('فایل باید عکس باشد', ErrorCodes.VALIDATION_ERROR);
    }

    // Validate file size (5MB max)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      console.log('[POST /api/news/upload-temp-image] File too large:', file.size);
      return errorResponse('حجم فایل بیش از 5MB است', ErrorCodes.VALIDATION_ERROR);
    }

    console.log('[POST /api/news/upload-temp-image] File validation passed, converting to buffer');

    // Convert file to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('[POST /api/news/upload-temp-image] Buffer created, size:', buffer.length);

    console.log('[POST /api/news/upload-temp-image] Saving to storage');
    const url = await saveTempFileToStorage(buffer, file.name);
    console.log('[POST /api/news/upload-temp-image] File saved, URL:', url);

    return successResponse(
      { url },
      'عکس به موفقیت آپلود شد'
    );
  } catch (error) {
    console.error('[POST /api/news/upload-temp-image] Error:', error);
    if (error instanceof Error) {
      console.error('[POST /api/news/upload-temp-image] Error message:', error.message);
      console.error('[POST /api/news/upload-temp-image] Error stack:', error.stack);
    }
    return errorResponse(
      'خطا در آپلود عکس',
      ErrorCodes.INTERNAL_ERROR,
      undefined,
      500
    );
  }
}
