/**
 * Admin CRM Deal Stage Move API
 * PATCH /api/admin/crm/deals/[id]/stage - Move a deal to another pipeline stage
 *
 * Dedicated small-payload endpoint (body: { stageId }) specifically for the
 * kanban drag-and-drop mutation — does not require a full deal payload.
 *
 * Authentication: JWT Bearer token from admin login
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  ErrorCodes,
  notFoundResponse,
  successResponse,
  validationError,
  HttpStatus,
} from "@/lib/api-response";
import { DealStageMoveSchema } from "@/lib/schemas/crm-deal-schema";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse(
        "Please login to continue",
        ErrorCodes.UNAUTHORIZED,
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = DealStageMoveSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return validationError(errors);
    }

    const { stageId } = parsed.data;

    const [existingDeal, newStage] = await Promise.all([
      prisma.deal.findUnique({ where: { id }, select: { stageId: true } }),
      prisma.pipelineStage.findUnique({ where: { id: stageId } }),
    ]);

    if (!existingDeal) {
      return notFoundResponse("Deal", "فرصت فروش یافت نشد");
    }
    if (!newStage) {
      return validationError({ stageId: "مرحله پایپ‌لاین یافت نشد" });
    }

    const isClosingStage = newStage.isWon || newStage.isLost;

    const deal = await prisma.deal.update({
      where: { id },
      data: {
        stageId,
        closedAt: isClosingStage ? new Date() : null,
      },
      include: {
        stage: true,
        lead: { select: { id: true, firstName: true, lastName: true, phone: true } },
        customer: { select: { id: true, firstName: true, lastName: true, phone: true } },
        ownerAdmin: { select: { id: true, name: true } },
      },
    });

    if (existingDeal.stageId !== stageId) {
      await prisma.activity.create({
        data: {
          type: "STATUS_CHANGE",
          content: `مرحله فرصت فروش به «${newStage.name}» تغییر کرد`,
          dealId: id,
          adminId: adminUser.id,
        },
      });
    }

    return successResponse(deal, "مرحله فرصت فروش با موفقیت تغییر کرد");
  } catch (error) {
    console.error("Error moving deal stage:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFoundResponse("Deal", "فرصت فروش یافت نشد");
    }
    return errorResponse("Error moving deal stage", ErrorCodes.DATABASE_ERROR);
  }
}
