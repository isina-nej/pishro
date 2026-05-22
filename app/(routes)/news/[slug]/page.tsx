import { notFound } from 'next/navigation';
import { getNewsBySlug } from '@/lib/services/news-service';
import NewsArticleDetail from '@/components/news/NewsArticleDetail';
import type { Metadata } from 'next';

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    return { title: 'خبر پیدا نشد' };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article || !article.published) {
    notFound();
  }

  return <NewsArticleDetail article={article} />;
}
