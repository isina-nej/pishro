import { query, type QueryValues } from "@/lib/db";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  contentType?: 'TEXT' | 'HTML' | 'MARKDOWN';
  coverImage?: string;
  author?: string;
  category: string;
  tags?: string[];
  published: boolean;
  publishedAt?: string;
  views: number;
  featured: boolean;
  readingTime?: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

interface GetNewsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  published?: boolean;
}

export async function getNews(params?: GetNewsParams) {
  try {
    const page = Math.max(1, params?.page || 1);
    const limit = Math.min(50, params?.limit || 12);
    const skip = (page - 1) * limit;

    let sql = `SELECT * FROM NewsArticle WHERE 1=1`;
    const sqlParams: QueryValues = [];

    // Default to published only if not specified
    if (params?.published === false) {
      sql += ` AND published = 0`;
    } else {
      sql += ` AND published = 1`;
    }

    if (params?.category) {
      sql += ` AND category = ?`;
      sqlParams.push(params.category);
    }

    if (params?.search) {
      sql += ` AND (title LIKE ? OR content LIKE ?)`;
      const searchTerm = `%${params.search}%`;
      sqlParams.push(searchTerm, searchTerm);
    }

    sql += ` ORDER BY publishedAt DESC, createdAt DESC`;

    const countSql = sql.replace(/SELECT \*/g, "SELECT COUNT(*) as total");
    const countResult = await query<{ total: number }>(countSql, sqlParams);
    const total = countResult[0]?.total || 0;

    sql += ` LIMIT ${limit} OFFSET ${skip}`;

    const articles = await query<NewsArticle>(sql, sqlParams);

    return {
      items: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    const articles = await query<NewsArticle>(
      `SELECT * FROM NewsArticle WHERE slug = ? AND published = 1 LIMIT 1`,
      [slug]
    );
    
    if (articles.length > 0) {
      // Increment views
      await query(`UPDATE NewsArticle SET views = views + 1 WHERE id = ?`, [
        articles[0].id,
      ]);
      return articles[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching news:", error);
    return null;
  }
}

export async function getFeaturedNews(limit: number = 3) {
  try {
    const news = await query<NewsArticle>(
      `SELECT * FROM NewsArticle WHERE published = 1 AND featured = 1 ORDER BY publishedAt DESC LIMIT ${limit}`,
      []
    );
    return news;
  } catch (error) {
    console.error("Error fetching featured news:", error);
    return [];
  }
}
