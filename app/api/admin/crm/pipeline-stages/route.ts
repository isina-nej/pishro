/**
 * Admin CRM Pipeline Stages API
 * GET /api/admin/crm/pipeline-stages - List all pipeline stages (auto-seeds defaults if empty)
 * POST /api/admin/crm/pipeline-stages - Create a new pipeline stage
 *
 * Authentication: JWT Bearer token from admin login
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromHeaders } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  createdResponse,
  errorResponse,
  ErrorCodes,
  successResponse,
  validationError,
} from "@/lib/api-response";
import { PipelineStageCreateSchema } from "@/lib/schemas/crm-deal-schema";

function requireAdmin(req: NextRequest) {
  return getAdminAuthFromHeaders(req.headers);
}

const DEFAULT_STAGES: Prisma.PipelineStageCreateManyInput[] = [
  { name: "سرنخ اولیه", order: 1 },
  { name: "در تماس", order: 2 },
  { name: "پیشنهاد ارسال شد", order: 3 },
  { name: "برنده", order: 4, isWon: true },
  { name: "از دست رفته", order: 5, isLost: true },
];

/**
 * در صورتی که هنوز هیچ مرحله‌ای در پایپ‌لاین وجود نداشته باشد، مجموعه پیش‌فرض
 * مراحل را ایجاد می‌کند. ایمن برای فراخوانی مکرر چون با شمارش رکوردها محافظت شده است.
 */
async function ensureDefaultStages() {
  const count = await prisma.pipelineStage.count();
  if (count === 0) {
    await prisma.pipelineStage.createMany({ data: DEFAULT_STAGES });
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    await ensureDefaultStages();

    const stages = await prisma.pipelineStage.findMany({
      orderBy: { order: "asc" },
    });

    return successResponse(stages, "مراحل پایپ‌لاین با موفقیت دریافت شد");
  } catch (error) {
    console.error("Error fetching pipeline stages:", error);
    return errorResponse("Error fetching pipeline stages", ErrorCodes.DATABASE_ERROR);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = requireAdmin(req);
    if (!adminUser) {
      return errorResponse("Please login to continue", ErrorCodes.UNAUTHORIZED);
    }

    const body = await req.json();
    const parsed = PipelineStageCreateSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return validationError(errors);
    }

    const { name, order, color, isWon, isLost } = parsed.data;

    const existingOrder = await prisma.pipelineStage.findUnique({ where: { order } });
    if (existingOrder) {
      return validationError({ order: "مرحله‌ای با این ترتیب از قبل وجود دارد" });
    }

    const stage = await prisma.pipelineStage.create({
      data: {
        name,
        order,
        color: color || null,
        isWon: isWon ?? false,
        isLost: isLost ?? false,
      },
    });

    return createdResponse(stage, "مرحله پایپ‌لاین با موفقیت ایجاد شد");
  } catch (error) {
    console.error("Error creating pipeline stage:", error);
    return errorResponse("Error creating pipeline stage", ErrorCodes.DATABASE_ERROR);
  }
}
