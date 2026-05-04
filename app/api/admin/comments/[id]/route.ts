/**
 * Admin Comment Management API (Single Comment)
 * GET /api/admin/comments/[id] - Get comment by ID
 * PATCH /api/admin/comments/[id] - Update comment
 * DELETE /api/admin/comments/[id] - Delete comment
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
    const comment = await prisma.comment.findUnique({
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
        course: {
            subject: true,
            slug: true
        category: {
            title: true,
        }
      }
    });
    if (!comment) {
      return notFoundResponse("Comment", "Comment not found");
    return successResponse(comment);
  } catch (error) {
    console.error("Error fetching comment:", error);
    return errorResponse(
      "Error fetching comment",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
export async function PATCH(
    const body = await req.json();
    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id }
    if (!existingComment) {
    // Prepare update data
    const updateData: Record<string, unknown> = {};
    // Only include fields that are provided
    if (body.text !== undefined) updateData.text = body.text;
    if (body.rating !== undefined) updateData.rating = body.rating;
    if (body.userName !== undefined) updateData.userName = body.userName;
    if (body.userAvatar !== undefined) updateData.userAvatar = body.userAvatar;
    if (body.userRole !== undefined) updateData.userRole = body.userRole;
    if (body.userCompany !== undefined) updateData.userCompany = body.userCompany;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.verified !== undefined) updateData.verified = body.verified;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.views !== undefined) updateData.views = body.views;
    const updatedComment = await prisma.comment.update({
      data: updateData,
    return successResponse(updatedComment, "Comment updated successfully");
    console.error("Error updating comment:", error);
      "Error updating comment",
export async function DELETE(
    // Delete comment
    await prisma.comment.delete({
    return noContentResponse();
    console.error("Error deleting comment:", error);
      "Error deleting comment",
