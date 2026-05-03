/**
 * Admin Revalidate API Route
 * POST /api/admin/revalidate
 * Manually trigger ISR revalidation for specific paths after content updates
 */

import { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  failResponse,
  ErrorCodes,
} from "@/lib/api-response";

/**
 * POST request to revalidate cached pages
 * Body params:
 * - path: Single path or array of paths to revalidate
 * - tag: Single tag or array of tags to revalidate
 * - type: 'path' or 'tag' (default: 'path')
 *
 * Examples:
 * 1. Revalidate single category page:
 *    { "path": "/courses/airdrop" }
 *
 * 2. Revalidate multiple pages:
 *    { "path": ["/courses/airdrop", "/courses/nft"] }
 *
 * 3. Revalidate by tag:
 *    { "tag": "category", "type": "tag" }
 *
 * 4. Revalidate specific category and its API:
 *    { "path": ["/courses/airdrop", "/api/categories/airdrop"] }
 */
export async function POST(req: NextRequest) {
  try {
    // Auth check - only admins can revalidate
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    // Check if user is admin (assuming role field exists in user model)
    if (session.user.role !== "admin") {
      return unauthorizedResponse("شما دسترسی به این عملیات ندارید");
    }

    // Parse request body
    const body = await req.json();
    const { path, tag, type = "path" } = body;

    // Validation
    if (!path && !tag) {
      return failResponse(
        {
          path: "path یا tag الزامی است"
        },
        "لطفاً path یا tag را مشخص کنید"
      );
    }

    const revalidated: string[] = [];
    const failed: string[] = [];

    // Revalidate by path
    if (type === "path" && path) {
      const paths = Array.isArray(path) ? path : [path];

      for (const p of paths) {
        try {
          // Validate path format
          if (!p.startsWith("/")) {
            failed.push(p);
            continue;
          }

          revalidatePath(p);
          revalidated.push(p);
        } catch (error) {
          console.error(`Error revalidating path ${p}:`, error);
          failed.push(p);
        }
      }
    }

    // Revalidate by tag
    if (type === "tag" && tag) {
      const tags = Array.isArray(tag) ? tag : [tag];

      for (const t of tags) {
        try {
          revalidateTag(t);
          revalidated.push(`tag:${t}`);
        } catch (error) {
          console.error(`Error revalidating tag ${t}:`, error);
          failed.push(`tag:${t}`);
        }
      }
    }

    // Build response
    const response = {
      message: "فرآیند بازخوانی کش با موفقیت انجام شد",
      revalidated,
      failed: failed.length > 0 ? failed : undefined,
      timestamp: new Date().toISOString(),
    };

    return successResponse(response);
  } catch (error) {
    console.error("Error in revalidate API:", error);
    return errorResponse(
      "خطا در فرآیند بازخوانی کش",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}

/**
 * GET request to check revalidation status and get available paths
 * Useful for admin dashboard
 */
export async function GET() {
  try {
    // Auth check
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse("لطفاً وارد حساب کاربری خود شوید");
    }

    if (session.user.role !== "admin") {
      return unauthorizedResponse("شما دسترسی به این عملیات ندارید");
    }

    // Return available paths and tags that can be revalidated
    const availablePaths = {
      categories: [
        "/courses/airdrop",
        "/courses/nft",
        "/courses/cryptocurrency",
        "/courses/stock-market",
        "/courses/metaverse",
      ],
      apis: [
        "/api/categories/airdrop",
        "/api/categories/nft",
        "/api/categories/cryptocurrency",
        "/api/categories/stock-market",
        "/api/categories/metaverse",
      ],
      tags: ["category", "courses", "tags", "faqs", "comments"],
    };

    const response = {
      message: "لیست مسیرهای قابل بازخوانی",
      paths: availablePaths,
      revalidateInterval: 3600, // 1 hour in seconds
      lastRevalidation: new Date().toISOString(),
    };

    return successResponse(response);
  } catch (error) {
    console.error("Error fetching revalidation info:", error);
    return errorResponse(
      "خطا در دریافت اطلاعات بازخوانی",
      ErrorCodes.INTERNAL_ERROR
    );
  }
}
