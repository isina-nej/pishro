import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookDetailContent from "@/components/library/BookDetailContent";
import { getBookBySlug } from "@/lib/services/library-mysql";

export const revalidate = 3600;

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

function normalizeBook(raw: Record<string, unknown>) {
  const tags = Array.isArray(raw.tags)
    ? (raw.tags as unknown[]).filter((t): t is string => typeof t === "string")
    : typeof raw.tags === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(raw.tags);
            return Array.isArray(parsed)
              ? parsed.filter((t): t is string => typeof t === "string")
              : [];
          } catch {
            return [];
          }
        })()
      : [];
  const formats = Array.isArray(raw.formats)
    ? (raw.formats as unknown[]).filter((f): f is string => typeof f === "string")
    : typeof raw.formats === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(raw.formats);
            return Array.isArray(parsed)
              ? parsed.filter((f): f is string => typeof f === "string")
              : [];
          } catch {
            return [];
          }
        })()
      : [];
  return {
    id: String(raw.id ?? ""),
    slug: String(raw.slug ?? ""),
    title: String(raw.title ?? ""),
    author: String(raw.author ?? ""),
    description: String(raw.description ?? ""),
    cover: typeof raw.cover === "string" ? raw.cover : undefined,
    category: String(raw.category ?? ""),
    rating: Number(raw.rating ?? 0),
    votes: Number(raw.votes ?? 0),
    views: Number(raw.views ?? 0),
    downloads: Number(raw.downloads ?? 0),
    year: Number(raw.year ?? new Date().getFullYear()),
    pages: raw.pages != null ? Number(raw.pages) : undefined,
    isbn: typeof raw.isbn === "string" ? raw.isbn : undefined,
    language: String(raw.language ?? "فارسی"),
    publisher: typeof raw.publisher === "string" ? raw.publisher : undefined,
    formats,
    price: raw.price != null ? Number(raw.price) : undefined,
    fileUrl: typeof raw.fileUrl === "string" ? raw.fileUrl : undefined,
    audioUrl: typeof raw.audioUrl === "string" ? raw.audioUrl : undefined,
    tags,
    readingTime: typeof raw.readingTime === "string" ? raw.readingTime : undefined,
    isFeatured: Boolean(raw.isFeatured),
  };
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book || (book.bookStatus && book.bookStatus !== "PUBLISHED")) {
    return { title: "کتاب یافت نشد | پیشرو" };
  }

  const canonicalPath = `/library/${slug}`;
  const title = `${book.title} | پیشرو`;
  const description = (book.description ?? "").slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      type: "book",
      url: canonicalPath,
      images: book.cover ? [book.cover] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: book.cover ? [book.cover] : [],
    },
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book || (book.bookStatus && book.bookStatus !== "PUBLISHED")) {
    notFound();
  }

  const normalized = normalizeBook(book as unknown as Record<string, unknown>);
  const canonicalPath = `/library/${slug}`;
  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: normalized.title,
    author: { "@type": "Person", name: normalized.author },
    description: normalized.description,
    ...(normalized.cover ? { image: [normalized.cover] } : {}),
    ...(normalized.isbn ? { isbn: normalized.isbn } : {}),
    inLanguage: normalized.language,
    publisher: normalized.publisher
      ? { "@type": "Organization", name: normalized.publisher }
      : { "@type": "Organization", name: "پیشرو" },
    url: `https://pishrosarmaye.com${canonicalPath}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <BookDetailContent book={normalized} />
    </>
  );
}
