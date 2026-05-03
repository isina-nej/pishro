import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all courses
    const courses = await query<any>(
      "SELECT id, subject, img, description FROM `Course` LIMIT 20"
    );

    const stats = {
      total: courses.length,
      withImages: courses.filter((c) => c.img).length,
      withoutImages: courses.filter((c) => !c.img).length,
      courses: courses,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error checking courses:", error);
    return NextResponse.json(
      { error: "Failed to check courses" },
      { status: 500 }
    );
  }
}
