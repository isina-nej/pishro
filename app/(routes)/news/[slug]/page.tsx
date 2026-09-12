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

  const canonicalPath = `/news/${slug}`;
  const publishedTime = article.publishedAt?.toISOString?.() ?? undefined;
  const ogImage = article.coverImageMobile ?? article.coverImage;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: canonicalPath,
      publishedTime,
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article || !article.published) {
    notFound();
  }

  const publishedTime = article.publishedAt?.toISOString?.() ?? undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    ...((article.coverImageMobile ?? article.coverImage) ? { image: [article.coverImageMobile ?? article.coverImage] } : {}),
    ...(publishedTime ? { datePublished: publishedTime } : {}),
    author: article.author ? { "@type": "Person", name: article.author } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsArticleDetail article={article} />
    </>
  );
}
