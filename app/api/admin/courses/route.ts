/**
 * Admin Courses Management API
 * GET /api/admin/courses - List all courses with pagination and filters
 * POST /api/admin/courses - Create a new course
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  unauthorizedResponse,
  paginatedResponse,
  createdResponse,
  ErrorCodes,
  forbiddenResponse,
  validationError,
} from "@/lib/api-response";
import { normalizeImageUrl } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const searchParams = req.nextUrl.searchParams;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");
    const published = searchParams.get("published");
    const featured = searchParams.get("featured");
    const status = searchParams.get("status");
    const level = searchParams.get("level");

    // Build where clause
    const where: Prisma.CourseWhereInput = {};

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { instructor: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    if (featured === "true") {
      where.featured = true;
    } else if (featured === "false") {
      where.featured = false;
    }

    if (status && (status === "ACTIVE" || status === "COMING_SOON" || status === "ARCHIVED")) {
      where.status = status as Prisma.EnumCourseStatusFilter;
    }

    if (level && (level === "BEGINNER" || level === "INTERMEDIATE" || level === "ADVANCED")) {
      where.level = level as Prisma.EnumCourseLevelNullableFilter;
    }

    // Fetch courses
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
          relatedTags: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
          _count: {
            select: {
              comments: true,
              enrollments: true,
              orderItems: true,
              quizzes: true,
            },
          },
        },
      }),
      prisma.course.count({ where }),
    ]);

    return paginatedResponse(courses, page, limit, total);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return errorResponse(
      "Error fetching courses",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const body = await req.json();
    const {
      subject,
      price,
      img,
      rating,
      description,
      discountPercent,
      time,
      students,
      videosCount,
      categoryId,
      tagIds = [],
      slug,
      level,
      language = "FA",
      prerequisites = [],
      learningGoals = [],
      instructor,
      status = "ACTIVE",
      published = true,
      featured = false,
    } = body;

    // Validation
    if (!subject || price === undefined) {
      return validationError({
        subject: !subject ? "Subject is required" : "",
        price: price === undefined ? "Price is required" : "",
      });
    }

    // If slug is provided, check uniqueness
    if (slug) {
      const existingCourse = await prisma.course.findUnique({
        where: { slug },
      });

      if (existingCourse) {
        return errorResponse(
          "Course with this slug already exists",
          ErrorCodes.ALREADY_EXISTS
        );
      }
    }

    // Normalize img URL (extract original URL from Next.js optimization URLs)
    const normalizedImg = normalizeImageUrl(img);

    // Create course
    const course = await prisma.course.create({
      data: {
        subject,
        price,
        img: normalizedImg,
        rating,
        description,
        discountPercent,
        time,
        students,
        videosCount,
        categoryId,
        tagIds,
        slug,
        level,
        language,
        prerequisites,
        learningGoals,
        instructor,
        status,
        published,
        featured,
      },
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        relatedTags: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    return createdResponse(course, "Course created successfully");
  } catch (error) {
    console.error("Error creating course:", error);
    return errorResponse(
      "Error creating course",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
