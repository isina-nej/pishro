import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest) {
  try {
    const book = await prisma.digitalBook.create({
      data: {
        title: "کتاب تست",
        slug: "test-book",
        author: "نویسنده تست",
        description: "این یک کتاب تست برای بررسی سیستم آپلود است",
        cover: "/uploads/books/covers/test_cover.jpg",
        fileUrl: "/uploads/books/pdfs/test_book.pdf",
        audioUrl: null,
        publisher: "ناشر تست",
        year: 2025,
        category: "تست",
        language: "فارسی",
      },
    });

    return Response.json({
      message: "کتاب تست ایجاد شد",
      book: {
        id: book.id,
        title: book.title,
        slug: book.slug,
        cover: book.cover,
        fileUrl: book.fileUrl,
        audioUrl: book.audioUrl,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Create book error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
