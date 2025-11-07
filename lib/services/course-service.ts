import axios from "axios";
import type { Course } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ApiSuccessResponse } from "@/lib/api-response";

export async function getCourses(): Promise<Course[]> {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
        : "http://localhost:3000";
    const { data } = await axios.get<ApiSuccessResponse<Course[]>>(`${baseUrl}/api/courses`, {
      headers: { "Cache-Control": "no-cache" },
    });

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to fetch courses");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
}

export async function getCoursesByPrisma() {
  return prisma.course.findMany({ orderBy: { createdAt: "desc" } });
}
