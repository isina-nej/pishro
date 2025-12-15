/**
 * Admin Newsletter Subscriber Management API (Single Subscriber)
 * GET /api/admin/newsletter-subscribers/[id] - Get subscriber by ID
 * DELETE /api/admin/newsletter-subscribers/[id] - Delete subscriber
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

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id },
    });

    if (!subscriber) {
      return notFoundResponse("NewsletterSubscriber", "Subscriber not found");
    }

    return successResponse(subscriber);
  } catch (error) {
    console.error("Error fetching newsletter subscriber:", error);
    return errorResponse(
      "Error fetching newsletter subscriber",
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

    // Check if subscriber exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id },
    });

    if (!existingSubscriber) {
      return notFoundResponse("NewsletterSubscriber", "Subscriber not found");
    }

    // Delete subscriber
    await prisma.newsletterSubscriber.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    console.error("Error deleting newsletter subscriber:", error);
    return errorResponse(
      "Error deleting newsletter subscriber",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
