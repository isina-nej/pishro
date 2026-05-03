import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    const books = await prisma.digitalBook.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        cover: true,
        fileUrl: true,
        audioUrl: true,
      },
      take: 5,
    });

    return Response.json({
      count: books.length,
      books: books.map(b => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        cover: b.cover || "❌ null",
        fileUrl: b.fileUrl || "❌ null",
        audioUrl: b.audioUrl || "❌ null",
      })),
    }, { status: 200 });
  } catch (error) {
    console.error("Debug error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
