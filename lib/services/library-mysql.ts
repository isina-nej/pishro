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
  bookStatus?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  tags?: string[] | object;
  readingTime?: string;
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
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publicOnly?: boolean; // Only show PUBLISHED books
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

    // Filter by status
    if (params?.publicOnly) {
      // Only show PUBLISHED books for public view
      sql += ` AND bookStatus = 'PUBLISHED'`;
    } else if (params?.status) {
      sql += ` AND bookStatus = ?`;
      sqlParams.push(params.status);
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

export async function getBookById(id: string) {
  try {
    const books = await query<DigitalBook>(
      `SELECT * FROM DigitalBook WHERE id = ? LIMIT 1`,
      [id]
    );
    return books[0] || null;
  } catch (error) {
    console.error("Error fetching book by id:", error);
    return null;
  }
}

export async function createBook(data: Partial<DigitalBook> & { title: string; slug: string; author: string; year: number }) {
  try {
    const id = `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    // Format as MySQL datetime: YYYY-MM-DD HH:MM:SS
    const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');

    const sql = `INSERT INTO DigitalBook (
      id, title, slug, author, description, cover, publisher, year, pages, isbn, 
      language, rating, votes, views, downloads, category, formats, bookStatus, tags, readingTime, isFeatured, price,
      fileUrl, audioUrl, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await query(sql, [
      id,
      data.title,
      data.slug,
      data.author,
      data.description || null,
      data.cover || null,
      data.publisher || null,
      data.year,
      data.pages || null,
      data.isbn || null,
      data.language || 'فارسی',
      0, // rating
      0, // votes
      0, // views
      0, // downloads
      data.category || null,
      data.formats ? JSON.stringify(data.formats) : '[]',
      'DRAFT', // bookStatus - always start as DRAFT
      data.tags ? JSON.stringify(Array.isArray(data.tags) ? data.tags : []) : '[]',
      data.readingTime || null,
      data.isFeatured ? 1 : 0,
      data.price || null,
      data.fileUrl || null,
      data.audioUrl || null,
      mysqlDateTime,
      mysqlDateTime
    ]);

    return { id, ...data, rating: 0, votes: 0, views: 0, downloads: 0, createdAt: mysqlDateTime, updatedAt: mysqlDateTime };
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
}

export async function updateBook(id: string, data: Partial<DigitalBook>) {
  try {
    const now = new Date();
    // Format as MySQL datetime: YYYY-MM-DD HH:MM:SS
    const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    // Build dynamic UPDATE query
    const fieldsToUpdate = [
      'title',
      'slug',
      'author',
      'description',
      'cover',
      'publisher',
      'year',
      'pages',
      'isbn',
      'language',
      'category',
      'formats',
      'bookStatus',
      'tags',
      'readingTime',
      'isFeatured',
      'price',
      'fileUrl',
      'audioUrl',
    ];

    fieldsToUpdate.forEach((field) => {
      if (field in data) {
        updateFields.push(`${field} = ?`);
        const value = data[field as keyof DigitalBook];
        
        if (field === 'formats' && Array.isArray(value)) {
          updateValues.push(JSON.stringify(value));
        } else if (field === 'tags' && (Array.isArray(value) || typeof value === 'object')) {
          updateValues.push(JSON.stringify(Array.isArray(value) ? value : []));
        } else if (field === 'isFeatured') {
          updateValues.push(value ? 1 : 0);
        } else {
          updateValues.push(value || null);
        }
      }
    });

    updateFields.push('updatedAt = ?');
    updateValues.push(mysqlDateTime);
    updateValues.push(id); // WHERE clause

    const sql = `UPDATE DigitalBook SET ${updateFields.join(', ')} WHERE id = ?`;

    await query(sql, updateValues);

    // Fetch and return updated book
    return getBookById(id);
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
}

export async function deleteBook(id: string) {
  try {
    const sql = `DELETE FROM DigitalBook WHERE id = ?`;
    await query(sql, [id]);
    return { success: true };
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
}

// Status transition functions
export async function publishBook(id: string) {
  try {
    const now = new Date();
    const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
    
    const sql = `UPDATE DigitalBook SET bookStatus = ?, updatedAt = ? WHERE id = ?`;
    await query(sql, ['PUBLISHED', mysqlDateTime, id]);
    
    return getBookById(id);
  } catch (error) {
    console.error("Error publishing book:", error);
    throw error;
  }
}

export async function archiveBook(id: string) {
  try {
    const now = new Date();
    const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
    
    const sql = `UPDATE DigitalBook SET bookStatus = ?, updatedAt = ? WHERE id = ? AND bookStatus = ?`;
    await query(sql, ['ARCHIVED', mysqlDateTime, id, 'PUBLISHED']);
    
    return getBookById(id);
  } catch (error) {
    console.error("Error archiving book:", error);
    throw error;
  }
}

export async function restoreBook(id: string) {
  try {
    const now = new Date();
    const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
    
    const sql = `UPDATE DigitalBook SET bookStatus = ?, updatedAt = ? WHERE id = ? AND bookStatus = ?`;
    await query(sql, ['PUBLISHED', mysqlDateTime, id, 'ARCHIVED']);
    
    return getBookById(id);
  } catch (error) {
    console.error("Error restoring book:", error);
    throw error;
  }
}
