import { NextRequest } from "next/server";
import { query } from "@/lib/db";
import { successResponse, errorResponse, paginatedResponse, ErrorCodes } from "@/lib/api-response";

/** Page size for courses infinite scroll — 12 cards = 4 rows x 3 cols on desktop. */
const COURSES_PAGE_SIZE = 12;

type SortKey = "جدیدترین" | "محبوب‌ترین" | "پرفروش‌ترین";

const LEVEL_MAP: Record<string, string> = {
  "مقدماتی": "BEGINNER",
  "متوسط": "INTERMEDIATE",
  "پیشرفته": "ADVANCED",
};

function orderClause(sort: SortKey): string {
  if (sort === "محبوب‌ترین") return "rating DESC";
  if (sort === "پرفروش‌ترین") return "students DESC";
  return "createdAt DESC";
}

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(sp.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(sp.get("limit") || String(COURSES_PAGE_SIZE))));
    const skip = (page - 1) * limit;

    const search = sp.get("search")?.trim() || undefined;
    const level = sp.get("level") || undefined;
    const categoryId = sp.get("categoryId") || undefined;
    const sort = (sp.get("sort") || "جدیدترین") as SortKey;

    const where: string[] = ["published = true"];
    const params: (string | number)[] = [];

    if (categoryId && categoryId !== "همه") {
      where.push("categoryId = ?");
      params.push(categoryId);
    }
    if (level && level !== "همه") {
      const mapped = LEVEL_MAP[level] ?? level;
      where.push("level = ?");
      params.push(mapped);
    }
    if (search) {
      where.push("(subject LIKE ? OR description LIKE ? OR instructor LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    const whereSql = `WHERE ${where.join(" AND ")}`;
    const order = orderClause(sort);

    const countRows = await query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM Course ${whereSql}`,
      params
    );
    const total = Number(countRows?.[0]?.total ?? 0);

    const rows = await query(
      `SELECT id, subject, price, img, rating, description, discountPercent, time, students,
              videosCount, instructor, slug, categoryId, level, status, published, createdAt, updatedAt,
              introVideoUrl, introMutedByDefault
       FROM Course ${whereSql}
       ORDER BY ${order}
       LIMIT ${limit} OFFSET ${skip}`,
      params
    );

    return paginatedResponse(
      (rows || []).map((r) => ({
        ...(r as object),
        // ponytail: keep row shape; UI only reads listed fields
      })),
      page,
      limit,
      total
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return errorResponse(
      "خطایی در دریافت دوره‌ها رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
