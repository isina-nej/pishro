import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // اگه نداریش پایین نوشتم چطور بسازی

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
