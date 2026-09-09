/**
 * Admin Category detail API
 * GET /api/admin/categories/[id] - single category with counts
 * PATCH /api/admin/categories/[id] - update category
 * DELETE /api/admin/categories/[id] - delete; linked courses detached (categoryId=null)
 */

import { NextRequest } from "next/server";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  successResponse,
  notFoundResponse,
  ErrorCodes,
  validationError,
  HttpStatus,
} from "@/lib/api-response";
import { normalizeImageUrl } from "@/lib/utils";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const adminAuth = requireAdmin(req);
  if (!adminAuth) {
    return errorResponse(
      "Please login to continue",
      ErrorCodes.UNAUTHORIZED,
      undefined,
      HttpStatus.UNAUTHORIZED
    );
  }

  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      _count: {
        select: {
          courses: true,
          content: true,
          news: true,
          faqs: true,
          comments: true,
          quizzes: true,
        },
      },
    },
  });

  if (!category) return notFoundResponse("Category", "دسته‌بندی یافت نشد");
  return successResponse(category, "دسته‌بندی با موفقیت دریافت شد");
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const adminAuth = requireAdmin(req);
  if (!adminAuth) {
    return errorResponse(
      "Please login to continue",
      ErrorCodes.UNAUTHORIZED,
      undefined,
      HttpStatus.UNAUTHORIZED
    );
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return notFoundResponse("Category", "دسته‌بندی یافت نشد");

  if (body.slug && body.slug !== existing.slug) {
    const clash = await prisma.category.findUnique({ where: { slug: body.slug } });
    if (clash) {
      return errorResponse(
        "Category with this slug already exists",
        ErrorCodes.ALREADY_EXISTS
      );
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(body.slug !== undefined ? { slug: body.slug } : {}),
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.description !== undefined ? { description: body.description ?? null } : {}),
      ...(body.icon !== undefined ? { icon: body.icon ?? null } : {}),
      ...(body.coverImage !== undefined
        ? { coverImage: normalizeImageUrl(body.coverImage) }
        : {}),
      ...(body.color !== undefined ? { color: body.color ?? null } : {}),
      ...(body.metaTitle !== undefined ? { metaTitle: body.metaTitle ?? null } : {}),
      ...(body.metaDescription !== undefined
        ? { metaDescription: body.metaDescription ?? null }
        : {}),
      ...(body.metaKeywords !== undefined ? { metaKeywords: body.metaKeywords ?? [] } : {}),
      ...(body.heroTitle !== undefined ? { heroTitle: body.heroTitle ?? null } : {}),
      ...(body.heroSubtitle !== undefined ? { heroSubtitle: body.heroSubtitle ?? null } : {}),
      ...(body.heroDescription !== undefined
        ? { heroDescription: body.heroDescription ?? null }
        : {}),
      ...(body.heroImage !== undefined
        ? { heroImage: normalizeImageUrl(body.heroImage) }
        : {}),
      ...(body.heroCta1Text !== undefined ? { heroCta1Text: body.heroCta1Text ?? null } : {}),
      ...(body.heroCta1Link !== undefined ? { heroCta1Link: body.heroCta1Link ?? null } : {}),
      ...(body.heroCta2Text !== undefined ? { heroCta2Text: body.heroCta2Text ?? null } : {}),
      ...(body.heroCta2Link !== undefined ? { heroCta2Link: body.heroCta2Link ?? null } : {}),
      ...(body.aboutTitle1 !== undefined ? { aboutTitle1: body.aboutTitle1 ?? null } : {}),
      ...(body.aboutTitle2 !== undefined ? { aboutTitle2: body.aboutTitle2 ?? null } : {}),
      ...(body.aboutDescription !== undefined
        ? { aboutDescription: body.aboutDescription ?? null }
        : {}),
      ...(body.aboutImage !== undefined
        ? { aboutImage: normalizeImageUrl(body.aboutImage) }
        : {}),
      ...(body.aboutCta1Text !== undefined
        ? { aboutCta1Text: body.aboutCta1Text ?? null }
        : {}),
      ...(body.aboutCta1Link !== undefined
        ? { aboutCta1Link: body.aboutCta1Link ?? null }
        : {}),
      ...(body.aboutCta2Text !== undefined
        ? { aboutCta2Text: body.aboutCta2Text ?? null }
        : {}),
      ...(body.aboutCta2Link !== undefined
        ? { aboutCta2Link: body.aboutCta2Link ?? null }
        : {}),
      ...(body.statsBoxes !== undefined ? { statsBoxes: body.statsBoxes ?? [] } : {}),
      ...(body.enableUserLevelSection !== undefined
        ? { enableUserLevelSection: Boolean(body.enableUserLevelSection) }
        : {}),
      ...(body.published !== undefined ? { published: Boolean(body.published) } : {}),
      ...(body.featured !== undefined ? { featured: Boolean(body.featured) } : {}),
      ...(body.order !== undefined ? { order: Number(body.order) || 0 } : {}),
    },
    include: {
      tags: { include: { tag: true } },
    },
  });

  return successResponse(category, "دسته‌بندی به‌روزرسانی شد");
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const adminAuth = requireAdmin(req);
  if (!adminAuth) {
    return errorResponse(
      "Please login to continue",
      ErrorCodes.UNAUTHORIZED,
      undefined,
      HttpStatus.UNAUTHORIZED
    );
  }

  const { id } = await params;
  const existing = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { courses: true } } },
  });
  if (!existing) return notFoundResponse("Category", "دسته‌بندی یافت نشد");

  // ponytail: detach (SetNull) keeps courses alive; block-delete when hard-delete required
  await prisma.$transaction([
    prisma.course.updateMany({ where: { categoryId: id }, data: { categoryId: null } }),
    prisma.category.delete({ where: { id } }),
  ]);

  return successResponse(
    { detachedCourses: existing._count.courses },
    existing._count.courses > 0
      ? `${existing._count.courses.toLocaleString("fa-IR")} دوره از دسته‌بندی جدا و دسته‌بندی حذف شد`
      : "دسته‌بندی حذف شد"
  );
}

export async function PUT(req: NextRequest, ctx: RouteParams) {
  const res = await PATCH(req, ctx);
  return res;
}
