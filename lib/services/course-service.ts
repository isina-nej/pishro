import axios from "axios";
import type { Course } from "@/types/prisma";
import { ApiSuccessResponse } from "@/lib/api-response";
import { getBaseUrl } from "@/lib/get-base-url";

export async function getCourses(): Promise<Course[]> {
  try {
    const baseUrl = getBaseUrl();
    const { data } = await axios.get<ApiSuccessResponse<Course[]>>(
      `${baseUrl}/api/courses`,
      {}
    );

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to fetch courses");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
}
