/**
 * Admin Users Management API
 * GET /api/admin/users - List all users with pagination and filters
 * POST /api/admin/users - Create a new user
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
import bcrypt from "bcryptjs";

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
    const role = searchParams.get("role");
    const phoneVerified = searchParams.get("phoneVerified");

    // Build where clause
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { phone: { contains: search } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { nationalCode: { contains: search } },
      ];
    }

    if (role && (role === "USER" || role === "ADMIN")) {
      where.role = role as Prisma.EnumUserRoleFilter;
    }

    if (phoneVerified === "true") {
      where.phoneVerified = true;
    } else if (phoneVerified === "false") {
      where.phoneVerified = false;
    }

    // Fetch users
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          phone: true,
          phoneVerified: true,
          role: true,
          firstName: true,
          lastName: true,
          email: true,
          nationalCode: true,
          birthDate: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              comments: true,
              orders: true,
              enrollments: true,
              transactions: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return paginatedResponse(users, page, limit, total);
  } catch (error) {
    console.error("Error fetching users:", error);
    return errorResponse(
      "Error fetching users",
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
      phone,
      password,
      role = "USER",
      firstName,
      lastName,
      email,
      nationalCode,
      phoneVerified = false,
    } = body;

    // Validation
    if (!phone || !password) {
      return validationError({
        phone: !phone ? "Phone is required" : "",
        password: !password ? "Password is required" : "",
      });
    }

    // Validate phone format
    if (!/^09\d{9}$/.test(phone)) {
      return validationError({
        phone: "Invalid phone format. Must be 09XXXXXXXXX",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return errorResponse(
        "User with this phone already exists",
        ErrorCodes.ALREADY_EXISTS
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        phone,
        passwordHash,
        role: role as "USER" | "ADMIN",
        firstName,
        lastName,
        email,
        nationalCode,
        phoneVerified,
      },
      select: {
        id: true,
        phone: true,
        phoneVerified: true,
        role: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    return createdResponse(user, "User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    return errorResponse(
      "Error creating user",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
