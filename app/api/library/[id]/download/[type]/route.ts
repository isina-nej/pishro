import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/auth-simple";
import { getBookById } from "@/lib/services/library-mysql";
import { canDownloadBookContent } from "@/lib/services/library-download-policy";
import { prisma } from "@/lib/prisma";

/** Download route used by the public library UI. No paid-book entitlement model yet. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; type: string }> }
) {
  const { id, type } = await params;
  if (!["pdf", "audio", "cover"].includes(type)) {
    return NextResponse.json({ error: "Invalid download type" }, { status: 400 });
  }

  const book = await getBookById(id);
  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
  const admin = await getAdminAuth(request);
  const isAdmin = admin?.role === "ADMIN";
  if (book.bookStatus !== "PUBLISHED" && !isAdmin) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
  if (type !== "cover" && !canDownloadBookContent(book.bookStatus, book.price, isAdmin)) {
    return NextResponse.json({ error: "Purchase access is required" }, { status: 403 });
  }

  const url = type === "pdf" ? book.fileUrl : type === "audio" ? book.audioUrl : book.cover;
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "File not available" }, { status: 404 });
  }
  let target: URL;
  try { target = new URL(url, request.url); }
  catch { return NextResponse.json({ error: "Invalid file URL" }, { status: 400 }); }
  const origin = new URL(request.url).origin;
  const prefix = type === "pdf" ? "/api/uploads/books/pdfs/" : "/api/uploads/books/audio/";
  // Book content must stay within our protected upload proxy; never redirect to
  // arbitrary external URLs or unrelated private file paths.
  if (type !== "cover" && (target.origin !== origin || !target.pathname.startsWith(prefix) ||
      target.search || target.hash)) {
    return NextResponse.json({ error: "Unsupported book file location" }, { status: 403 });
  }
  if (type === "cover" && (target.protocol !== "https:" && target.origin !== origin)) {
    return NextResponse.json({ error: "Unsupported cover URL" }, { status: 400 });
  }

  if (type !== "cover") {
    await prisma.digitalBook.update({ where: { id: book.id }, data: { downloads: { increment: 1 } } })
      .catch(() => undefined); // Do not block an authorized download for a failed metric.
  }
  return NextResponse.redirect(target, {
    status: 307,
    headers: { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" },
  });
}
