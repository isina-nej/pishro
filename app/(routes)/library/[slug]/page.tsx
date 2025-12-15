import BookDetail from "@/components/library/BookDetail";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface BookDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { slug } = await params;

  // Find book by slug to get the ID
  const book = await prisma.digitalBook.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!book) {
    notFound();
  }

  return <BookDetail bookId={book.id} />;
}
