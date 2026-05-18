/**
 * Block-Based News Service Layer
 * 
 * Service for managing block-based news articles (News model) with CRUD operations,
 * block management, and validation logic. All Prisma operations happen here.
 * 
 * API routes should call these functions, never access Prisma directly.
 * 
 * This is separate from the legacy news-service.ts which handles NewsArticle.
 */

import { prisma } from '@/lib/prisma';
import { CreateNewsSchema, UpdateNewsSchema, BlockInputSchema, ReorderBlocksSchema } from '@/lib/schemas/block-news-schema';

/**
 * Create a new news article with DRAFT status
 */
export async function createNews(data: {
  title: string;
  description?: string;
  thumbnail?: string;
  categoryId?: string;
  authorId: string;
}) {
  const validated = CreateNewsSchema.parse(data);
  
  // Generate slug from title
  const slug = generateSlug(validated.title);
  
  // Check if slug already exists
  const existing = await prisma.news.findUnique({ where: { slug } });
  if (existing) {
    throw new Error(`مقاله با این آدرس قبلا ایجاد شده است: ${slug}`);
  }

  const news = await prisma.news.create({
    data: {
      title: validated.title,
      slug,
      description: validated.description || '',
      thumbnail: validated.thumbnail || null,
      categoryId: validated.categoryId,
      authorId: validated.authorId,
      status: 'DRAFT',
    },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true, email: true, phone: true },
      },
      category: { select: { id: true, title: true, slug: true } },
      contentBlocks: true,
    },
  });

  return news;
}

/**
 * Fetch a single news article with all blocks
 */
export async function getNews(id: string) {
  const news = await prisma.news.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true, email: true, phone: true },
      },
      category: { select: { id: true, title: true, slug: true } },
      contentBlocks: {
        orderBy: { sortOrder: 'asc' },
      },
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

  // Build where clause
  const where: Record<string, unknown> = {};
  if (filters.status) where.status = filters.status;
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where,
      skip,
      take: limit,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        category: { select: { id: true, title: true } },
        _count: { select: { contentBlocks: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.news.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    pagination: { page, limit, total, totalPages },
  };
}

/**
 * Update news article metadata (title, slug, description, category, thumbnail, publishedAt)
 * Does NOT update blocks or status
 */
export async function updateNewsMetadata(
  id: string,
  data: {
    title?: string;
    slug?: string;
    description?: string;
    categoryId?: string | null;
    thumbnail?: string;
    publishedAt?: string | null;
  }
) {
  const validated = UpdateNewsSchema.parse(data);

  // If slug is provided, check uniqueness
  if (validated.slug) {
    const existing = await prisma.news.findUnique({
      where: { slug: validated.slug },
    });
    if (existing && existing.id !== id) {
      throw new Error(`مقاله دیگری با این آدرس وجود دارد`);
    }
  }

  const news = await prisma.news.update({
    where: { id },
    data: {
      ...(validated.title && { title: validated.title }),
      ...(validated.slug && { slug: validated.slug }),
      ...(validated.description !== undefined && { description: validated.description }),
      ...(validated.categoryId !== undefined && { categoryId: validated.categoryId }),
      ...(validated.thumbnail !== undefined && { thumbnail: validated.thumbnail }),
      ...(validated.publishedAt !== undefined && { publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : null }),
    },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true },
      },
      category: { select: { id: true, title: true } },
      contentBlocks: { orderBy: { sortOrder: 'asc' } },
    },
  });

  return news;
}

/**
 * Publish a news article (change status from DRAFT to PUBLISHED, set publishedAt if not already set)
 */
export async function publishNews(id: string) {
  // First, get the current news to check if publishedAt is already set
  const currentNews = await prisma.news.findUnique({
    where: { id },
    select: { publishedAt: true },
  });

  if (!currentNews) {
    throw new Error('خبر یافت نشد');
  }

  const news = await prisma.news.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      // Only set publishedAt to now if it wasn't already scheduled
      publishedAt: currentNews.publishedAt || new Date(),
    },
    include: {
      author: { select: { id: true, firstName: true, lastName: true } },
      category: { select: { id: true, title: true } },
      contentBlocks: { orderBy: { sortOrder: 'asc' } },
    },
  });

  return news;
}

/**
 * Archive a news article (change status to ARCHIVED)
 */
export async function archiveNews(id: string) {
  const news = await prisma.news.update({
    where: { id },
    data: { status: 'ARCHIVED' },
    include: {
      author: { select: { id: true, firstName: true, lastName: true } },
      category: { select: { id: true, title: true } },
      contentBlocks: { orderBy: { sortOrder: 'asc' } },
    },
  });

  return news;
}

/**
 * Delete a news article (cascade deletes all blocks)
 */
export async function deleteNews(id: string) {
  await prisma.news.delete({
    where: { id },
  });

  return { message: 'مقاله و تمام بلاک‌های آن حذف شدند' };
}

/**
 * Add a new content block to an article
 * Auto-assigns sortOrder as max existing + 1
 */
export async function addContentBlock(
  newsId: string,
  data: {
    type: 'TEXT' | 'HEADING' | 'IMAGE' | 'GALLERY' | 'QUOTE' | 'LIST';
    content: Record<string, unknown>;
  }
) {
  // Validate block input
  const validated = BlockInputSchema.parse(data);

  // Get max sortOrder
  const maxBlock = await prisma.contentBlock.findFirst({
    where: { newsId },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });

  const nextSortOrder = (maxBlock?.sortOrder ?? -1) + 1;

  const block = await prisma.contentBlock.create({
    data: {
      newsId,
      type: validated.type,
      content: validated.content,
      sortOrder: nextSortOrder,
    },
  });

  return block;
}

/**
 * Update a content block's content (type is immutable)
 */
export async function updateContentBlock(
  newsId: string,
  blockId: string,
  data: { content: Record<string, unknown> }
) {
  // Fetch existing block to verify it belongs to this article
  const block = await prisma.contentBlock.findUnique({
    where: { id: blockId },
  });

  if (!block || block.newsId !== newsId) {
    throw new Error('بلاک مورد نظر در این مقاله یافت نشد');
  }

  // Validate content against block type
  const validated = BlockInputSchema.parse({
    type: block.type,
    content: data.content,
  });

  const updated = await prisma.contentBlock.update({
    where: { id: blockId },
    data: {
      content: validated.content,
    },
  });

  return updated;
}

/**
 * Delete a content block and reorder remaining blocks
 */
export async function deleteContentBlock(newsId: string, blockId: string) {
  // Fetch block to verify it belongs to this article
  const block = await prisma.contentBlock.findUnique({
    where: { id: blockId },
  });

  if (!block || block.newsId !== newsId) {
    throw new Error('بلاک مورد نظر در این مقاله یافت نشد');
  }

  // Delete block
  await prisma.contentBlock.delete({
    where: { id: blockId },
  });

  // Reorder remaining blocks (compact sortOrder)
  const remainingBlocks = await prisma.contentBlock.findMany({
    where: { newsId },
    orderBy: { sortOrder: 'asc' },
    select: { id: true },
  });

  // Update sortOrder for all remaining blocks
  await Promise.all(
    remainingBlocks.map((b: { id: string }, i: number) =>
      prisma.contentBlock.update({
        where: { id: b.id },
        data: { sortOrder: i },
      })
    )
  );

  return { message: 'بلاک حذف شد و ترتیب بلاک‌ها به‌روز شد' };
}

/**
 * Reorder blocks atomically
 * Validates all blockIds belong to newsId, then updates sortOrder in transaction
 */
export async function reorderBlocks(
  newsId: string,
  newOrder: Array<{ blockId: string; sortOrder: number }>
) {
  // Validate input
  const validated = ReorderBlocksSchema.parse(newOrder);

  // Verify all blockIds belong to this news article
  const blocks = await prisma.contentBlock.findMany({
    where: { newsId },
    select: { id: true },
  });

  const blockIds = new Set(blocks.map((b: { id: string }) => b.id));
  const orderBlockIds = new Set(validated.map((o) => o.blockId));

  // Check all requested blocks exist in this article
  for (const blockId of orderBlockIds) {
    if (!blockIds.has(blockId)) {
      throw new Error(`بلاک ${blockId} در این مقاله وجود ندارد`);
    }
  }

  // Check no extra blocks in article (all blocks must be reordered)
  if (blockIds.size !== orderBlockIds.size) {
    throw new Error('تعداد بلاک‌های ارائه شده با تعداد بلاک‌های موجود تطابق ندارد');
  }

  // Check sortOrder is contiguous (0, 1, 2, ..., n-1)
  const sortOrders = validated.map((o) => o.sortOrder).sort((a, b) => a - b);
  for (let i = 0; i < sortOrders.length; i++) {
    if (sortOrders[i] !== i) {
      throw new Error('ترتیب بلاک‌ها باید پی‌درپی باشند (0, 1, 2, ...)');
    }
  }

  // Update all sortOrders in atomic transaction
  await prisma.$transaction(
    validated.map((o) =>
      prisma.contentBlock.update({
        where: { id: o.blockId },
        data: { sortOrder: o.sortOrder },
      })
    )
  );

  // Fetch updated blocks in order
  const updatedBlocks = await prisma.contentBlock.findMany({
    where: { newsId },
    orderBy: { sortOrder: 'asc' },
  });

  return updatedBlocks;
}

/**
 * Helper: Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric except space and hyphen
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
