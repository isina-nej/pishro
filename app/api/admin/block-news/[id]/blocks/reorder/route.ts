/**
 * PATCH /api/admin/block-news/[id]/blocks/reorder - Reorder content blocks (NOT SUPPORTED)
 */

import { errorResponse } from '@/lib/api-response';
import { getAdminAuth } from "@/lib/auth-simple";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminAuth = await getAdminAuth(req);
  if (!adminAuth) {
    return errorResponse('دسترسی محدود. فقط ادمین.');
  }

  return errorResponse('مدل جدید اخبار از بلاک‌ها پشتیبانی نمی‌کند', 'NOT_SUPPORTED');
}
