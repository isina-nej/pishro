/**
 * GET /api/admin/block-news/[id]/blocks - List all blocks for a news article (NOT SUPPORTED - NewsArticle doesn't use blocks)
 * POST /api/admin/block-news/[id]/blocks - Add new content block to news article (NOT SUPPORTED)
 */

import { errorResponse } from '@/lib/api-response';
import { getAdminAuth } from "@/lib/auth-simple";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminAuth = await getAdminAuth(req);
  if (!adminAuth) {
    return errorResponse('دسترسی محدود. فقط ادمین.');
  }

  return errorResponse('مدل جدید اخبار از بلاک‌ها پشتیبانی نمی‌کند', 'NOT_SUPPORTED');
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminAuth = await getAdminAuth(req);
  if (!adminAuth) {
    return errorResponse('دسترسی محدود. فقط ادمین.');
  }

  return errorResponse('مدل جدید اخبار از بلاک‌ها پشتیبانی نمی‌کند', 'NOT_SUPPORTED');
}
