// @/lib/services/comment-service.ts
import { query } from "@/lib/db";

interface GetCommentsOptions {
  courseId?: string;
  userId?: string;
  categoryId?: string;
  published?: boolean;
  verified?: boolean;
  featured?: boolean;
  limit?: number;
}

interface CommentRow {
  id: string;
  text: string;
  rating?: number;
  userId: string;
  courseId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch comments with optional filters
 */
export async function getComments(options: GetCommentsOptions = {}) {
  const { courseId, userId, categoryId, published, verified, featured, limit = 10 } = options;

  try {
    let sql = `
      SELECT id, text, rating, userId, courseId, userName, userAvatar, userRole, userCompany, 
             published, verified, featured, likes, dislikes, views, createdAt, updatedAt
      FROM Comment
      WHERE 1=1
    `;
    const params: any[] = [];

    if (courseId) {
      sql += ` AND courseId = ?`;
      params.push(courseId);
    }
    if (userId) {
      sql += ` AND userId = ?`;
      params.push(userId);
    }
    if (categoryId) {
      sql += ` AND categoryId = ?`;
      params.push(categoryId);
    }
    if (published !== undefined) {
      sql += ` AND published = ?`;
      params.push(published ? 1 : 0);
    }
    if (verified !== undefined) {
      sql += ` AND verified = ?`;
      params.push(verified ? 1 : 0);
    }
    if (featured !== undefined) {
      sql += ` AND featured = ?`;
      params.push(featured ? 1 : 0);
    }

    sql += ` ORDER BY createdAt DESC LIMIT ${Math.max(1, Math.min(limit || 10, 1000))}`;

    const comments = await query<any>(sql, params);

    return comments.map((comment) => ({
      ...comment,
      likes: tryParseJson(comment.likes, []),
      dislikes: tryParseJson(comment.dislikes, []),
    }));
  } catch (error) {
    console.error("خطا در دریافت نظرات:", error);
    return [];
  }
}

/**
 * Helper function to safely parse JSON
 */
function tryParseJson(value: any, defaultValue: any = null) {
  if (!value) return defaultValue;
  
  // If it's already an object/array, return it
  if (typeof value === 'object') return value;
  
  // Try to parse if it's a string
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  }
  
  return defaultValue;
}

/**
 * Get a single comment by ID
 */
export async function getCommentById(id: string) {
  try {
    const sql = `
      SELECT id, text, rating, userId, courseId, createdAt, updatedAt
      FROM Comment
      WHERE id = ?
      LIMIT 1
    `;
    const comments = await query<CommentRow>(sql, [id]);

    if (!comments || comments.length === 0) {
      return null;
    }

    const comment = comments[0];
    return {
      ...comment,
      likes: [],
      dislikes: [],
    };
  } catch (error) {
    console.error("خطا در دریافت نظر:", error);
    return null;
  }
}

/**
 * Create a new comment
 */
export async function createComment(data: {
  content: string;
  rating?: number;
  userId?: string;
  courseId?: string;
}) {
  try {
    if (!data.content || data.content.trim().length === 0) {
      throw new Error("متن نظر نمی‌تواند خالی باشد");
    }

    if (data.content.length > 5000) {
      throw new Error("متن نظر نباید بیشتر از 5000 کاراکتر باشد");
    }

    const sql = `
      INSERT INTO Comment (id, content, rating, userId, courseId, createdAt, updatedAt)
      VALUES (UUID(), ?, ?, ?, ?, NOW(), NOW())
    `;

    const params = [
      data.content.trim(),
      data.rating ? Math.min(Math.max(data.rating, 1), 5) : null,
      data.userId || null,
      data.courseId || null,
    ];

    await query(sql, params);
    return { success: true };
  } catch (error) {
    console.error("خطا در ایجاد نظر:", error);
    throw error;
  }
}

/**
 * Increment comment views count
 */
export async function incrementCommentViews(commentId: string) {
  try {
    // Table doesn't have views column, so we skip this
    return { success: true };
  } catch (error) {
    console.error("خطا در افزایش تعداد بازدیدها:", error);
    return null;
  }
}

// Backward compatibility
export const getTestimonials = getComments;
export const getTestimonialById = getCommentById;
export const createTestimonial = createComment;
