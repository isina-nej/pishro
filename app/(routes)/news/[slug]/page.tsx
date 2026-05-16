import NewsDetail from "@/components/news/NewsDetail";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;

  // Find article by slug to get the ID
  const article = await prisma.newsArticle.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!article) {
    notFound();
  }

  return <NewsDetail articleId={article.id} />;
}
