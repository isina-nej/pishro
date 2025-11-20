/**
 * Admin Single Video Management API (by database ID)
 * GET /api/admin/videos/[id] - Get a single video by database ID
 * PATCH /api/admin/videos/[id] - Update video metadata
 * DELETE /api/admin/videos/[id] - Delete a video
 */

import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  errorResponse,
  unauthorizedResponse,
  successResponse,
  ErrorCodes,
  forbiddenResponse,
  notFoundResponse,
} from "@/lib/api-response";
import {
  getVideoById,
  deleteVideo,
  updateVideo,
} from "@/lib/services/video-service";
import type { UpdateVideoInput } from "@/types/video";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("D7A' H'1/ 4HÌ/");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("/3*13Ì E-/H/ (G '/EÌF");
    }

    const { id } = await params;

    const video = await getVideoById(id);

    if (!video) {
      return notFoundResponse("Video", "HÌ/ÌH Ì'A* F4/");
    }

    return successResponse(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    return errorResponse(
      ".7' /1 /1Ì'A* HÌ/ÌH",
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
      return unauthorizedResponse("D7A' H'1/ 4HÌ/");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("/3*13Ì E-/H/ (G '/EÌF");
    }

    const { id } = await params;

    // (113Ì H,H/ HÌ/ÌH
    const existingVideo = await getVideoById(id);
    if (!existingVideo) {
      return notFoundResponse("Video", "HÌ/ÌH Ì'A* F4/");
    }

    const body: UpdateVideoInput = await req.json();

    try {
      // (1H213'FÌ (' '3*A'/G '2 videoId
      const updatedVideo = await updateVideo(existingVideo.videoId, body);

      return successResponse(updatedVideo, "HÌ/ÌH (' EHABÌ* (G1H213'FÌ 4/");
    } catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : ".7' /1 (G1H213'FÌ HÌ/ÌH";

      if (message.includes("Ì'A* F4/")) {
        return notFoundResponse("Video", message);
      }

      return errorResponse(message, ErrorCodes.DATABASE_ERROR);
    }
  } catch (error) {
    console.error("Error updating video:", error);
    return errorResponse(
      ".7' /1 (G1H213'FÌ HÌ/ÌH",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check - only admins
    const session = await auth();
    if (!session?.user) {
      return unauthorizedResponse("D7A' H'1/ 4HÌ/");
    }
    if (session.user.role !== "ADMIN") {
      return forbiddenResponse("/3*13Ì E-/H/ (G '/EÌF");
    }

    const { id } = await params;

    // (113Ì H,H/ HÌ/ÌH
    const existingVideo = await getVideoById(id);
    if (!existingVideo) {
      return notFoundResponse("Video", "HÌ/ÌH Ì'A* F4/");
    }

    try {
      // -0A (' '3*A'/G '2 videoId
      await deleteVideo(existingVideo.videoId);
      return successResponse(
        { deleted: true },
        "HÌ/ÌH (' EHABÌ* -0A 4/"
      );
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : ".7' /1 -0A HÌ/ÌH";

      if (message.includes("Ì'A* F4/")) {
        return notFoundResponse("Video", message);
      }

      return errorResponse(message, ErrorCodes.DATABASE_ERROR);
    }
  } catch (error) {
    console.error("Error deleting video:", error);
    return errorResponse(
      ".7' /1 -0A HÌ/ÌH",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
