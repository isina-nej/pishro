// @/app/api/testimonials/route.ts
import { NextRequest } from "next/server";
import { getTestimonials } from "@/lib/services/testimonial-service";
import { successResponse, errorResponse, ErrorCodes } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId") || undefined;
    const courseId = searchParams.get("courseId") || undefined;
    const published = searchParams.get("published") !== "false";
    const verified = searchParams.get("verified") === "true" ? true : undefined;
    const featured = searchParams.get("featured") === "true" ? true : undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;

    const testimonials = await getTestimonials({
      categoryId,
      courseId,
      published,
      verified,
      featured,
      limit,
    });

    return successResponse(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return errorResponse(
      "خطایی در دریافت نظرات رخ داد",
      ErrorCodes.DATABASE_ERROR
    );
  }
}
