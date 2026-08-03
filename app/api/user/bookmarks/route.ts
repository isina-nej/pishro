// @/app/api/user/bookmarks/route.ts
// نشان‌شده‌های کاربر: خواندن لیست پنل، افزودن و حذف یک آیتم

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  notFoundResponse,
  validationError,
  errorResponse,
  ErrorCodes,
} from "@/lib/api-response";
import {
  BOOKMARK_COLUMN,
  BookmarkTargetSchema,
  type BookmarkTarget,
} from "@/lib/schemas/bookmark-schema";
import type { BookmarkItem } from "@/lib/types/bookmark";

/**
 * ستون‌هایی که برای ساختن کارت پنل لازم است. با include یک کوئری، هر سه نوع
 * آیتم با هم می‌آیند — بدون N+1.
 */
const bookmarkInclude = {
  course: {
    select: {
      id: true,
      subject: true,
      img: true,
      slug: true,
      instructor: true,
      price: true,
      discountPercent: true,
    },
  },
  newsArticle: {
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
      category: true,
      author: true,
      publishedAt: true,
    },
  },
  digitalBook: {
    select: {
      id: true,
      title: true,
      slug: true,
      cover: true,
      author: true,
      category: true,
    },
  },
} satisfies Prisma.BookmarkInclude;

type BookmarkWithItem = Prisma.BookmarkGetPayload<{ include: typeof bookmarkInclude }>;

/**
 * ردیف دیتابیس را به شکل یکدستی تبدیل می‌کند که کارت پنل بدون دانستن نوع آیتم
 * بتواند رندرش کند. اگر هر سه رابطه خالی باشد (که با کلید خارجی نباید پیش
 * بیاید) مقدار null برمی‌گردد تا از لیست بیفتد.
 */
function toBookmarkItem(bookmark: BookmarkWithItem): BookmarkItem | null {
  const base = { id: bookmark.id, createdAt: bookmark.createdAt.toISOString() };

  if (bookmark.course) {
    const course = bookmark.course;
    return {
      ...base,
      type: "course",
      itemId: course.id,
      title: course.subject,
      image: course.img,
      // دوره صفحهٔ عمومی اختصاصی ندارد و از مودال روی صفحهٔ لیست باز می‌شود.
      href: "/courses",
      subtitle: course.instructor,
      badge: null,
    };
  }

  if (bookmark.newsArticle) {
    const article = bookmark.newsArticle;
    return {
      ...base,
      type: "news",
      itemId: article.id,
      title: article.title,
      image: article.coverImage,
      href: `/news/${article.slug}`,
      subtitle: article.author,
      badge: article.category || null,
    };
  }

  if (bookmark.digitalBook) {
    const book = bookmark.digitalBook;
    return {
      ...base,
      type: "book",
      itemId: book.id,
      title: book.title,
      image: book.cover,
      href: `/library/${book.slug}`,
      subtitle: book.author,
      badge: book.category || null,
    };
  }

  return null;
}

/** GET /api/user/bookmarks — همهٔ نشان‌های کاربر، تازه‌ترین اول */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: bookmarkInclude,
    });

    const items = bookmarks
      .map(toBookmarkItem)
      .filter((item): item is BookmarkItem => item !== null);

    return successResponse({ items });
  } catch (error) {
    console.error("[GET /api/user/bookmarks] error:", error);
    return errorResponse(
      "خطایی در دریافت لیست نشان‌شده‌ها رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/** بدنهٔ درخواست را می‌خواند و اعتبارسنجی می‌کند */
async function parseTarget(req: Request): Promise<
  { ok: true; target: BookmarkTarget } | { ok: false; response: Response }
> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { ok: false, response: validationError({ body: "بدنهٔ درخواست معتبر نیست" }) };
  }

  const parsed = BookmarkTargetSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      response: validationError({
        type: fieldErrors.type?.[0] ?? "",
        itemId: fieldErrors.itemId?.[0] ?? "",
      }),
    };
  }

  return { ok: true, target: parsed.data };
}

/** POST /api/user/bookmarks — افزودن یک آیتم به نشان‌شده‌ها */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("برای نشان‌کردن باید وارد حساب کاربری شوید");
    }

    const parsed = await parseTarget(req);
    if (!parsed.ok) return parsed.response;
    const { type, itemId } = parsed.target;

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        [BOOKMARK_COLUMN[type]]: itemId,
      },
      include: bookmarkInclude,
    });

    return createdResponse(toBookmarkItem(bookmark), "به لیست شما اضافه شد");
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // قبلاً نشان شده — درخواست دوباره را موفق حساب می‌کنیم تا دکمهٔ کلاینت
      // با دو کلیک سریع خطا نگیرد.
      if (error.code === "P2002") {
        return successResponse(null, "این آیتم از قبل در لیست شماست");
      }
      // شناسه‌ای که کلید خارجی نپذیرفت، یعنی چنین دوره/خبر/کتابی وجود ندارد.
      if (error.code === "P2003") {
        return notFoundResponse("item", "آیتم مورد نظر پیدا نشد");
      }
    }

    console.error("[POST /api/user/bookmarks] error:", error);
    return errorResponse("خطایی در ثبت نشان رخ داد", ErrorCodes.DATABASE_ERROR);
  }
}

/** DELETE /api/user/bookmarks — حذف یک آیتم از نشان‌شده‌ها */
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    const parsed = await parseTarget(req);
    if (!parsed.ok) return parsed.response;
    const { type, itemId } = parsed.target;

    // deleteMany چون شرط روی userId هم هست: نشان کاربر دیگری حذف نمی‌شود و
    // نبودن ردیف هم خطا نمی‌دهد.
    await prisma.bookmark.deleteMany({
      where: { userId: session.user.id, [BOOKMARK_COLUMN[type]]: itemId },
    });

    return successResponse(null, "از لیست شما حذف شد");
  } catch (error) {
    console.error("[DELETE /api/user/bookmarks] error:", error);
    return errorResponse("خطایی در حذف نشان رخ داد", ErrorCodes.DATABASE_ERROR);
  }
}
