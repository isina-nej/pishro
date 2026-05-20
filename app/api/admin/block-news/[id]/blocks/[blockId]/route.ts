/**
 * GET /api/admin/block-news/[id]/blocks/[blockId] - Get single content block (NOT SUPPORTED)
 * PATCH /api/admin/block-news/[id]/blocks/[blockId] - Update content block (NOT SUPPORTED)
 * DELETE /api/admin/block-news/[id]/blocks/[blockId] - Delete content block (NOT SUPPORTED)
 */

import { errorResponse } from '@/lib/api-response';
import { getAdminAuth } from "@/lib/auth-simple";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; blockId: string }> }
) {
  const adminAuth = await getAdminAuth(req);
  if (!adminAuth) {
    return errorResponse('دسترسی محدود. فقط ادمین.');
  }

  return errorResponse('مدل جدید اخبار از بلاک‌ها پشتیبانی نمی‌کند', 'NOT_SUPPORTED');
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; blockId: string }> }
) {
  const adminAuth = await getAdminAuth(req);
  if (!adminAuth) {
    return errorResponse('دسترسی محدود. فقط ادمین.');
  }

  return errorResponse('مدل جدید اخبار از بلاک‌ها پشتیبانی نمی‌کند', 'NOT_SUPPORTED');
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; blockId: string }> }
) {
  const adminAuth = await getAdminAuth(req);
  if (!adminAuth) {
    return errorResponse('دسترسی محدود. فقط ادمین.');
  }

  return errorResponse('مدل جدید اخبار از بلاک‌ها پشتیبانی نمی‌کند', 'NOT_SUPPORTED');
}
