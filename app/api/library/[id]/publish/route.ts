import { NextRequest, NextResponse } from 'next/server';
import { publishBook } from '@/lib/services/library-mysql';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'کتاب مشخص نشده است' },
        { status: 400 }
      );
    }

    const book = await publishBook(id);

    return NextResponse.json({
      status: 'success',
      message: 'کتاب منتشر شد',
      data: book,
    });
  } catch (error) {
    console.error('Error publishing book:', error);
    return NextResponse.json(
      { status: 'error', message: 'خطا در منتشر کردن کتاب' },
      { status: 500 }
    );
  }
}
