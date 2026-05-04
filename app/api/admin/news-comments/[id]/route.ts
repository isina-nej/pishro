/**
 * Admin News Comment Management API (Single Comment)
 * GET /api/admin/news-comments/[id] - Get news comment by ID
 * PATCH /api/admin/news-comments/[id] - Update news comment
 * DELETE /api/admin/news-comments/[id] - Delete news comment
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
    const comment = await prisma.newsComment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        },
        article: {
            title: true,
            slug: true
        }
      }
    });
    if (!comment) {
      return notFoundResponse("NewsComment", "News comment not found");
    return successResponse(comment);
  } catch (error) {
    console.error("Error fetching news comment:", error);
    return errorResponse(
      "Error fetching news comment",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
export async function PATCH(
    const body = await req.json();
    // Check if comment exists
    const existingComment = await prisma.newsComment.findUnique({
      where: { id }
    if (!existingComment) {
    // Prepare update data
    const updateData: Record<string, unknown> = {};
    // Only include fields that are provided
    if (body.content !== undefined) updateData.content = body.content;
    const updatedComment = await prisma.newsComment.update({
      data: updateData,
    return successResponse(updatedComment, "News comment updated successfully");
    console.error("Error updating news comment:", error);
      "Error updating news comment",
export async function DELETE(
    // Delete comment
    await prisma.newsComment.delete({
    return noContentResponse();
    console.error("Error deleting news comment:", error);
      "Error deleting news comment",
