/**
 * Admin Enrollment Management API (Single Enrollment)
 * GET /api/admin/enrollments/[id] - Get enrollment by ID
 * PATCH /api/admin/enrollments/[id] - Update enrollment
 * DELETE /api/admin/enrollments/[id] - Delete enrollment
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
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        course: {
            subject: true,
            slug: true,
            img: true,
            description: true
        }
      }
    });
    if (!enrollment) {
      return notFoundResponse("Enrollment", "Enrollment not found");
    return successResponse(enrollment);
  } catch (error) {
    console.error("Error fetching enrollment:", error);
    return errorResponse(
      "Error fetching enrollment",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
export async function PATCH(
    const body = await req.json();
    // Check if enrollment exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id }
    if (!existingEnrollment) {
    // Prepare update data
    const updateData: Record<string, unknown> = {};
    // Only include fields that are provided
    if (body.progress !== undefined) updateData.progress = body.progress;
    if (body.completedAt !== undefined) {
      updateData.completedAt = body.completedAt ? new Date(body.completedAt) : null;
    if (body.lastAccessAt !== undefined) {
      updateData.lastAccessAt = body.lastAccessAt ? new Date(body.lastAccessAt) : null;
    const updatedEnrollment = await prisma.enrollment.update({
      data: updateData,
            lastName: true
            slug: true
    return successResponse(updatedEnrollment, "Enrollment updated successfully");
    console.error("Error updating enrollment:", error);
      "Error updating enrollment",
export async function DELETE(
    // Delete enrollment
    await prisma.enrollment.delete({
    return noContentResponse();
    console.error("Error deleting enrollment:", error);
      "Error deleting enrollment",
