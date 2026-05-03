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
  
  // Decode URL-encoded slug
  const decodedSlug = decodeURIComponent(slug);

  // Find book by slug to get the ID
  const book = await prisma.digitalBook.findUnique({
    where: { slug: decodedSlug },
    select: { id: true },
  });

  if (!book) {
    notFound();
  }

  return <BookDetail bookId={book.id} />;
}
