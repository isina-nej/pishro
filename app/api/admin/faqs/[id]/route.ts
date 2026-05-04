/**
 * Admin FAQ Management API (Single FAQ)
 * GET /api/admin/faqs/[id] - Get FAQ by ID
 * PATCH /api/admin/faqs/[id] - Update FAQ
 * DELETE /api/admin/faqs/[id] - Delete FAQ
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
    const faq = await prisma.fAQ.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            title: true
          }
        }
      }
    });
    if (!faq) {
      return notFoundResponse("FAQ", "FAQ not found");
    return successResponse(faq);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return errorResponse(
      "Error fetching FAQ",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
export async function PATCH(
    const body = await req.json();
    // Check if FAQ exists
    const existingFaq = await prisma.fAQ.findUnique({
      where: { id }
    if (!existingFaq) {
    // Prepare update data
    const updateData: Record<string, unknown> = {};
    // Only include fields that are provided
    if (body.question !== undefined) updateData.question = body.question;
    if (body.answer !== undefined) updateData.answer = body.answer;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.faqCategory !== undefined) updateData.faqCategory = body.faqCategory;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.views !== undefined) updateData.views = body.views;
    if (body.helpful !== undefined) updateData.helpful = body.helpful;
    if (body.notHelpful !== undefined) updateData.notHelpful = body.notHelpful;
    const updatedFaq = await prisma.fAQ.update({
      data: updateData,
    return successResponse(updatedFaq, "FAQ updated successfully");
    console.error("Error updating FAQ:", error);
      "Error updating FAQ",
export async function DELETE(
    // Delete FAQ
    await prisma.fAQ.delete({
    return noContentResponse();
    console.error("Error deleting FAQ:", error);
      "Error deleting FAQ",
