/**
 * GET /api/admin/live-chat — list guest support chats
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminAuthFromRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  ErrorCodes,
  paginatedResponse,
} from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminAuthFromRequest(req);
    if (!admin) {
      return errorResponse("لطفا وارد شوید", ErrorCodes.UNAUTHORIZED, undefined, 401);
    }

    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status")?.trim();

    const where: Prisma.GuestChatConversationWhereInput = {};
    if (status && ["OPEN", "ACTIVE", "CLOSED"].includes(status)) {
      where.status = status as "OPEN" | "ACTIVE" | "CLOSED";
    }
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { phone: { contains: search } },
        { topic: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.guestChatConversation.findMany({
        where,
        orderBy: [{ lastMessageAt: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: { select: { messages: true } },
        },
      }),
      prisma.guestChatConversation.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error("admin live-chat list error:", error);
    return errorResponse("خطا در دریافت گفتگوها", ErrorCodes.DATABASE_ERROR);
  }
}
