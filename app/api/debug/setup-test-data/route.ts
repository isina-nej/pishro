import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    // Clear old books
    await prisma.digitalBook.deleteMany({});

    // Create a new book with local file URLs
    const book = await prisma.digitalBook.create({
      data: {
        title: "کتاب تست برای دانلود",
        slug: "test-download-book",
        author: "تست",
        description: "این کتاب برای تست دانلود فایل است",
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
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
