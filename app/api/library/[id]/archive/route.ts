import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/auth-simple';
import { archiveBook } from '@/lib/services/library-mysql';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminAuth(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'کتاب مشخص نشده است' },
        { status: 400 }
      );
    }

    const book = await archiveBook(id);

    return NextResponse.json({
      status: 'success',
      message: 'کتاب آرشیو شد',
      data: book,
    });
  } catch (error) {
    console.error('Error archiving book:', error);
    return NextResponse.json(
      { status: 'error', message: 'خطا در آرشیو کردن کتاب' },
      { status: 500 }
    );
  }
}
