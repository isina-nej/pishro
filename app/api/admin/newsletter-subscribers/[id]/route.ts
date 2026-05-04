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
  notFoundResponse,
  ErrorCodes,
  noContentResponse
} from "@/lib/api-response";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }
    if (session.user.role !== "ADMIN") {
      return errorResponse("Access denied. Admin only.", ErrorCodes.UNAUTHORIZED);
    const { id } = await params;
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id }
    });
    if (!subscriber) {
      return notFoundResponse("NewsletterSubscriber", "Subscriber not found");
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
    // Check if subscriber exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
    if (!existingSubscriber) {
    // Delete subscriber
    await prisma.newsletterSubscriber.delete({
    return noContentResponse();
    console.error("Error deleting newsletter subscriber:", error);
      "Error deleting newsletter subscriber",
