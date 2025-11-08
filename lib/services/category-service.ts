/**
 * Category Service
 * Handles all category-related database operations for dynamic category pages
 */

import { prisma } from "@/lib/prisma";
import { Prisma, PageContentType, CourseLevel } from "@prisma/client";

/**
 * Type for category with full relations
 */
export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    content: true;
    tags: true;
    courses: {
      include: {
        category: {
          select: {
            id: true;
            slug: true;
            title: true;
            color: true;
          };
        };
        relatedTags: true;
      };
    };
    faqs: true;
    comments: {
      include: {
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            avatarUrl: true;
          };
        };
      };
    };
  };
}>;

/**
 * Type for page content with proper JSON typing
 */
export interface PageContentData {
  title?: string;
  description?: string;
  image?: string;
  primaryButton?: {
    text: string;
    link: string;
  };
  secondaryButton?: {
    text: string;
    link: string;
  };
  features?: string[];
  paragraphs?: string[];
  stats?: Array<{
    label: string;
    value: string;
  }>;
}

/**
 * Fetch category by slug with all related data
 * @param slug - Category slug (e.g., 'airdrop', 'nft', 'cryptocurrency')
 * @returns Category with all relations or null if not found
 */
export async function getCategoryBySlug(
  slug: string
): Promise<CategoryWithRelations | null> {
  try {
    const category = await prisma.category.findUnique({
      where: {
        slug,
        published: true, // Only return published categories
      },
      include: {
        content: {
          where: {
            published: true,
            AND: [
              {
                OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }],
              },
              {
                OR: [{ expireAt: null }, { expireAt: { gte: new Date() } }],
              },
            ],
          },
          orderBy: {
            order: "asc",
          },
        },
        tags: {
          where: {
            published: true,
          },
          orderBy: {
            usageCount: "desc", // Most used tags first
          },
        },
        courses: {
          where: {
            published: true,
          },
          include: {
            category: {
              select: {
                id: true,
                slug: true,
                title: true,
                color: true,
              },
            },
            relatedTags: {
              where: {
                published: true,
              },
              take: 5,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        faqs: {
          where: {
            published: true,
          },
          orderBy: [{ featured: "desc" }, { order: "asc" }],
        },
        comments: {
          where: {
            published: true,
            verified: true,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          take: 10, // Limit comments to 10 most recent
        },
      },
    });

    return category;
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    throw error;
  }
}

/**
 * Fetch all published category slugs for static params generation
 * @returns Array of category slugs
 */
export async function getAllCategorySlugs(): Promise<string[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
      },
    });

    return categories.map((cat) => cat.slug);
  } catch (error) {
    console.error("Error fetching category slugs:", error);
    throw error;
  }
}

/**
 * Fetch category tags with optional filtering
 * @param categorySlug - Category slug
 * @param limit - Maximum number of tags to return
 * @returns Array of tags with usage stats
 */
export async function getCategoryTags(
  categorySlug: string,
  limit: number = 20
) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        slug: categorySlug,
        published: true,
      },
      include: {
        tags: {
          where: {
            published: true,
          },
          orderBy: [{ usageCount: "desc" }, { clicks: "desc" }],
          take: limit,
        },
      },
    });

    return category?.tags || [];
  } catch (error) {
    console.error(`Error fetching tags for category ${categorySlug}:`, error);
    throw error;
  }
}

/**
 * Fetch popular tags across all categories
 * @param limit - Maximum number of tags to return
 * @returns Array of most popular tags
 */
export async function getPopularTags(limit: number = 30) {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        published: true,
        usageCount: {
          gt: 0,
        },
      },
      orderBy: [{ usageCount: "desc" }, { clicks: "desc" }],
      take: limit,
      include: {
        _count: {
          select: {
            categories: true,
            courses: true,
            news: true,
          },
        },
      },
    });

    return tags;
  } catch (error) {
    console.error("Error fetching popular tags:", error);
    throw error;
  }
}

/**
 * Fetch FAQs for a specific category
 * @param categorySlug - Category slug
 * @param limit - Maximum number of FAQs to return
 * @returns Array of FAQs
 */
export async function getCategoryFAQs(
  categorySlug: string,
  limit: number = 10
) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        slug: categorySlug,
        published: true,
      },
      include: {
        faqs: {
          where: {
            published: true,
          },
          orderBy: [{ featured: "desc" }, { order: "asc" }],
          take: limit,
        },
      },
    });

    return category?.faqs || [];
  } catch (error) {
    console.error(`Error fetching FAQs for category ${categorySlug}:`, error);
    throw error;
  }
}

/**
 * Fetch page content by type for a category
 * @param categorySlug - Category slug
 * @param contentType - Type of content ('landing', 'about', 'hero', etc.)
 * @returns Page content or null
 */
export async function getCategoryContent(
  categorySlug: string,
  contentType: PageContentType
) {
  try {
    const content = await prisma.pageContent.findFirst({
      where: {
        category: {
          slug: categorySlug,
        },
        type: contentType,
        published: true,
        AND: [
          {
            OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }],
          },
          {
            OR: [{ expireAt: null }, { expireAt: { gte: new Date() } }],
          },
        ],
      },
    });

    return content;
  } catch (error) {
    console.error(
      `Error fetching content ${contentType} for category ${categorySlug}:`,
      error
    );
    throw error;
  }
}

/**
 * Fetch comments/testimonials for a category
 * @param categorySlug - Category slug
 * @param limit - Maximum number of comments
 * @returns Array of comments
 */
export async function getCategoryComments(
  categorySlug: string,
  limit: number = 10
) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
        published: true,
        verified: true,
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return comments;
  } catch (error) {
    console.error(
      `Error fetching comments for category ${categorySlug}:`,
      error
    );
    throw error;
  }
}

// Backward compatibility alias
export const getCategoryTestimonials = getCategoryComments;

/**
 * Fetch courses for a specific category with pagination
 * @param categorySlug - Category slug
 * @param options - Pagination and filter options
 * @returns Paginated course list
 */
export async function getCategoryCourses(
  categorySlug: string,
  options: {
    page?: number;
    limit?: number;
    level?: CourseLevel;
    featured?: boolean;
  } = {}
) {
  const { page = 1, limit = 12, level, featured } = options;
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.CourseWhereInput = {
      category: {
        slug: categorySlug,
      },
      published: true,
      ...(level && { level }),
      ...(featured !== undefined && { featured }),
    };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              slug: true,
              title: true,
              color: true,
            },
          },
          relatedTags: {
            where: {
              published: true,
            },
            take: 5,
          },
          _count: {
            select: {
              enrollments: true,
              comments: true,
            },
          },
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.course.count({ where }),
    ]);

    return {
      courses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error(
      `Error fetching courses for category ${categorySlug}:`,
      error
    );
    throw error;
  }
}

/**
 * Increment tag clicks when user clicks on a tag
 * @param tagId - Tag ID
 */
export async function incrementTagClicks(tagId: string): Promise<void> {
  try {
    await prisma.tag.update({
      where: { id: tagId },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error(`Error incrementing tag clicks for ${tagId}:`, error);
    // Don't throw - this is analytics, not critical
  }
}

/**
 * Increment FAQ views
 * @param faqId - FAQ ID
 */
export async function incrementFAQViews(faqId: string): Promise<void> {
  try {
    await prisma.fAQ.update({
      where: { id: faqId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error(`Error incrementing FAQ views for ${faqId}:`, error);
    // Don't throw - this is analytics, not critical
  }
}
