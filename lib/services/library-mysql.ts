import { query } from "@/lib/db";

interface DigitalBook {
  id: string;
  title: string;
  slug: string;
  author: string;
  description?: string;
  cover?: string;
  publisher?: string;
  year: number;
  pages?: number;
  isbn?: string;
  language: string;
  rating: number;
  votes: number;
  views: number;
  downloads: number;
  category: string;
  formats?: string[];
  isFeatured: boolean;
  price?: number;
  fileUrl?: string;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface GetBooksParams {
  page?: number;
  limit?: number;
  category?: string;
  format?: string;
  search?: string;
  sort?: "newest" | "oldest" | "rating" | "popular" | "downloads";
  featured?: boolean;
}

export async function getBooks(params?: GetBooksParams) {
  try {
    const page = Math.max(1, params?.page || 1);
    const limit = Math.min(50, params?.limit || 12);
    const skip = (page - 1) * limit;

    let sql = `SELECT * FROM DigitalBook WHERE 1=1`;
    const sqlParams: any[] = [];

    if (params?.category) {
      sql += ` AND category = ?`;
      sqlParams.push(params.category);
    }

    if (params?.search) {
      sql += ` AND (title LIKE ? OR author LIKE ? OR description LIKE ? OR publisher LIKE ?)`;
      const searchTerm = `%${params.search}%`;
      sqlParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (params?.featured) {
      sql += ` AND isFeatured = 1`;
    }

    // Build order clause
    let orderBy = "createdAt DESC";
    switch (params?.sort) {
      case "oldest":
        orderBy = "createdAt ASC";
        break;
      case "rating":
        orderBy = "rating DESC";
        break;
      case "popular":
        orderBy = "views DESC";
        break;
      case "downloads":
        orderBy = "downloads DESC";
        break;
      default:
        orderBy = "createdAt DESC";
    }

    sql += ` ORDER BY ${orderBy}`;

    const countSql = sql.replace(/SELECT \*/g, "SELECT COUNT(*) as total");
    const countResult = await query<{ total: number }>(countSql, sqlParams);
    const total = countResult[0]?.total || 0;

    sql += ` LIMIT ${limit} OFFSET ${skip}`;

    const books = await query<DigitalBook>(sql, sqlParams);

    return {
      items: books,
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
    console.error("Error fetching books:", error);
    throw error;
  }
}

export async function getBookBySlug(slug: string) {
  try {
    const books = await query<DigitalBook>(
      `SELECT * FROM DigitalBook WHERE slug = ? LIMIT 1`,
      [slug]
    );
    return books[0] || null;
  } catch (error) {
    console.error("Error fetching book:", error);
    return null;
  }
}
