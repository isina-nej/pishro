/**
 * News Article Service Layer
 * 
 * Service for managing news articles (NewsArticle model) with CRUD operations,
 * and validation logic. All Prisma operations happen here.
 * 
 * API routes should call these functions, never access Prisma directly.
 */

import { prisma } from '@/lib/prisma';
import { CreateNewsSchema, UpdateNewsSchema } from '@/lib/schemas/block-news-schema';
import { deleteFileFromStorage, getRelativePathFromUrl } from '@/lib/services/storage-adapter';

/**
 * Create a new news article with published=false (draft status)
 */
export async function createNews(data: {
  title: string;
  excerpt?: string;
  description?: string;  // Accept old naming
  content?: string;
  coverImage?: string;
  thumbnail?: string;  // Accept old naming
  categoryId?: string;
  author?: string;
  authorId?: string;
  publishedAt?: string | null;
}) {
  const validated = CreateNewsSchema.parse(data);
  
  // Generate slug from title
  const slug = generateSlug(validated.title);
  
  // Check if slug already exists
  const existing = await prisma.newsArticle.findUnique({ where: { slug } });
  if (existing) {
    throw new Error(`مقاله با این آدرس قبلا ایجاد شده است: ${slug}`);
  }

  // If publishedAt is provided, article is being scheduled for future publication
  const scheduledAt = validated.publishedAt || null;
  const isScheduled = Boolean(scheduledAt);
  
  const news = await prisma.newsArticle.create({
    data: {
      title: validated.title,
      slug,
      excerpt: validated.excerpt || '',
      content: validated.content || '',
      coverImage: validated.coverImage || null,
      categoryId: validated.categoryId,
      author: validated.author,
      category: validated.categoryId || 'عمومی',
      draft: !isScheduled,
      published: false,
      publishedAt: scheduledAt ? new Date(scheduledAt) : null,
    },
    include: {
      relatedCategory: { select: { id: true, title: true, slug: true } },
    },
  });

  return news;
}

/**
 * Fetch a single news article with all details
 */
export async function getNews(id: string) {
  const news = await prisma.newsArticle.findUnique({
    where: { id },
    include: {
      relatedCategory: { select: { id: true, title: true, slug: true } },
      relatedTags: { include: { tag: true } },
    },
  });

  if (!news) {
    throw new Error(`مقاله با شناسه ${id} یافت نشد`);
  }

  return news;
}

/**
 * Fetch paginated list of news articles with filters
 */
export async function getNewsList(
  page: number = 1,
  limit: number = 20,
  filters: {
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    categoryId?: string;
    search?: string;
  } = {}
) {
  const skip = (page - 1) * limit;

  // Build where clause based on status filter
  const where: Record<string, unknown> = {};
  
  if (filters.status === 'PUBLISHED') {
    where.published = true;
  } else if (filters.status === 'DRAFT') {
    where.published = false;
    where.draft = true;
  } else if (filters.status === 'ARCHIVED') {
    where.published = false;
    where.draft = false;
  }

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { excerpt: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.newsArticle.findMany({
      where,
      skip,
      take: limit,
      include: {
        relatedCategory: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.newsArticle.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    pagination: { page, limit, total, totalPages },
  };
}

/**
 * Update news article metadata (title, slug, excerpt, content, category, coverImage, author, publishedAt)
 */
export async function updateNewsMetadata(
  id: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    description?: string;
    content?: string;
    categoryId?: string | null;
    coverImage?: string;
    thumbnail?: string;
    author?: string;
    publishedAt?: string | null;
  }
) {
  const validated = UpdateNewsSchema.parse(data);

  // If slug is provided, check uniqueness
  if (validated.slug) {
    const existing = await prisma.newsArticle.findUnique({
      where: { slug: validated.slug },
    });
    if (existing && existing.id !== id) {
      throw new Error(`مقاله دیگری با این آدرس وجود دارد`);
    }
  }

  const news = await prisma.newsArticle.update({
    where: { id },
    data: {
      ...(validated.title && { title: validated.title }),
      ...(validated.slug && { slug: validated.slug }),
      ...(validated.excerpt !== undefined && { excerpt: validated.excerpt }),
      ...(validated.content !== undefined && { content: validated.content }),
      ...(validated.categoryId !== undefined && { categoryId: validated.categoryId }),
      ...(validated.coverImage !== undefined && { coverImage: validated.coverImage }),
      ...(validated.author !== undefined && { author: validated.author }),
      ...(validated.publishedAt !== undefined && { publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : null }),
    },
    include: {
      relatedCategory: { select: { id: true, title: true } },
    },
  });

  return news;
}

/**
 * Publish a news article (set published=true, set publishedAt if not already set)
 */
export async function publishNews(id: string) {
  // First, get the current news to check if publishedAt is already set
  const currentNews = await prisma.newsArticle.findUnique({
    where: { id },
    select: { publishedAt: true },
  });

  if (!currentNews) {
    throw new Error('خبر یافت نشد');
  }

  const news = await prisma.newsArticle.update({
    where: { id },
    data: {
      published: true,
      draft: false,
      // Only set publishedAt to now if it wasn't already scheduled
      publishedAt: currentNews.publishedAt || new Date(),
    },
    include: {
      relatedCategory: { select: { id: true, title: true } },
    },
  });

  return news;
}

/**
 * Archive a news article (set published=false, draft=false)
 */
export async function archiveNews(id: string) {
  const news = await prisma.newsArticle.update({
    where: { id },
    data: { 
      published: false,
      draft: false,
    },
    include: {
      relatedCategory: { select: { id: true, title: true } },
    },
  });

  return news;
}

/**
 * Delete a news article (and associated files from storage)
 */
export async function deleteNews(id: string) {
  // Fetch the news article first to get coverImage path
  const news = await prisma.newsArticle.findUnique({
    where: { id },
  });

  if (!news) {
    throw new Error('خبر مورد نظر یافت نشد');
  }

  // Delete coverImage file from storage if it exists
  if (news.coverImage) {
    try {
      const relativePath = getRelativePathFromUrl(news.coverImage);
      await deleteFileFromStorage(relativePath);
      console.log(`[deleteNews] Deleted cover image: ${relativePath}`);
    } catch (error) {
      console.error('[deleteNews] Error deleting cover image:', error);
      // Continue with deletion even if image deletion fails
    }
  }

  // Delete the news article from database
  await prisma.newsArticle.delete({
    where: { id },
  });

  return { message: 'مقاله و فایل‌های مرتبط حذف شدند' };
}

/**
 * Helper: Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  // Convert Persian/Farsi digits to English
  let slug = title
    .replace(/۰/g, '0')
    .replace(/۱/g, '1')
    .replace(/۲/g, '2')
    .replace(/۳/g, '3')
    .replace(/۴/g, '4')
    .replace(/۵/g, '5')
    .replace(/۶/g, '6')
    .replace(/۷/g, '7')
    .replace(/۸/g, '8')
    .replace(/۹/g, '9');

  // Use a transliteration map for common Persian characters
  const persianToLatin: Record<string, string> = {
    'آ': 'a', 'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's',
    'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z',
    'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's',
    'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f',
    'ق': 'q', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'و': 'v', 'ه': 'h', 'ی': 'y', 'ئ': 'e', 'ء': '',
  };

  // Transliterate Persian characters
  slug = slug.split('').map(char => persianToLatin[char.toLowerCase()] || char).join('');

  // Convert to lowercase and handle spaces and special characters
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric except space and hyphen
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

