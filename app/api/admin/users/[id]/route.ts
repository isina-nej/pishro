/**
 * Admin User Management API (Single User)
 * GET /api/admin/users/[id] - Get user by ID
 * PATCH /api/admin/users/[id] - Update user
 * DELETE /api/admin/users/[id] - Delete user
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  ErrorCodes,
  noContentResponse,
} from "@/lib/api-response";
import bcrypt from "bcryptjs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            comments: true,
            orders: true,
            enrollments: true,
            transactions: true,
            newsComments: true,
            quizAttempts: true,
          },
        },
      },
    });

    if (!user) {
      return notFoundResponse("User", "User not found");
    }

    // Remove password hash from response
    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;

    return successResponse(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user:", error);
    return errorResponse(
      "Error fetching user",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;
    const body = await req.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return notFoundResponse("User", "User not found");
    }

    // Prepare update data
    const updateData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      nationalCode?: string;
      birthDate?: Date;
      avatarUrl?: string;
      role?: "USER" | "ADMIN";
      phoneVerified?: boolean;
      cardNumber?: string;
      shebaNumber?: string;
      accountOwner?: string;
      passwordHash?: string;
    } = {};

    // Only include fields that are provided
    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.nationalCode !== undefined) updateData.nationalCode = body.nationalCode;
    if (body.birthDate !== undefined) updateData.birthDate = new Date(body.birthDate);
    if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.phoneVerified !== undefined) updateData.phoneVerified = body.phoneVerified;
    if (body.cardNumber !== undefined) updateData.cardNumber = body.cardNumber;
    if (body.shebaNumber !== undefined) updateData.shebaNumber = body.shebaNumber;
    if (body.accountOwner !== undefined) updateData.accountOwner = body.accountOwner;

    // If password is provided, hash it
    if (body.password) {
      updateData.passwordHash = await bcrypt.hash(body.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
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
        cardNumber: true,
        shebaNumber: true,
        accountOwner: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(updatedUser, "User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    return errorResponse(
      "Error updating user",
      ErrorCodes.DATABASE_ERROR
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("Please login to continue");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("Access denied. Admin only.");
    }

    const { id } = await params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return notFoundResponse("User", "User not found");
    }

    // Prevent deleting yourself
    if (id === session.user.id) {
      return forbiddenResponse("Cannot delete your own account");
    }

    // Delete user (cascading deletes will handle related records)
    await prisma.user.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting user:", error);
    return errorResponse(
      "Error deleting user",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
