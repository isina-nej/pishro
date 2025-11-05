import axios from "axios";
import type { Course } from "@prisma/client";

export async function getCourses(): Promise<Course[]> {
  try {
    const { data } = await axios.get<Course[]>("/api/courses", {
      headers: { "Cache-Control": "no-cache" },
    });
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
}
