/**
 * Admin Resume Items Management API
 * GET /api/admin/resume-items - List all resume items
 * POST /api/admin/resume-items - Create a new resume item
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { Prisma } from "@/types/prisma";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  validationError
} from "@/lib/api-response";
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("دسترسی محدود. فقط ادمین.", ErrorCodes.UNAUTHORIZED);
    const searchParams = req.nextUrl.searchParams;
    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;
    // Filters
    const aboutPageId = searchParams.get("aboutPageId");
    const published = searchParams.get("published");
    // Build where clause
    const where: Prisma.ResumeItemWhereInput = {};
    if (aboutPageId) {
      where.aboutPageId = aboutPageId;
    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    // Fetch resume items
    const [items, total] = await Promise.all([
      prisma.resumeItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
        include: {
          aboutPage: {
            select: {
              id: true,
              heroTitle: true
            }
          }
        }
      }),
      prisma.resumeItem.count({ where }),
    ]);
    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("Error fetching resume items:", error);
    return errorResponse(
      "خطا در دریافت آیتم‌های رزومه",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
export async function POST(req: NextRequest) {
    const body = await req.json();
    const {
      aboutPageId,
      icon,
      title,
      description,
      color,
      bgColor,
      order = 0,
      published = false
    } = body;
    // Validation
    if (!aboutPageId || !title || !description) {
      return validationError({
        aboutPageId: !aboutPageId ? "شناسه صفحه درباره ما الزامی است" : "",
        title: !title ? "عنوان الزامی است" : "",
        description: !description ? "توضیحات الزامی است" : ""
      });
    // Check if about page exists
    const aboutPage = await prisma.aboutPage.findUnique({
      where: { id: aboutPageId }
    });
    if (!aboutPage) {
      return errorResponse(
        "صفحه درباره ما یافت نشد",
        ErrorCodes.NOT_FOUND
      );
    // Create resume item
    const item = await prisma.resumeItem.create({
      data: {
        aboutPageId,
        icon,
        title,
        description,
        color,
        bgColor,
        order,
        published
      },
      include: {
        aboutPage: {
          select: {
            id: true,
            heroTitle: true
      }
    return createdResponse(item, "آیتم رزومه با موفقیت ایجاد شد");
    console.error("Error creating resume item:", error);
      "خطا در ایجاد آیتم رزومه",
