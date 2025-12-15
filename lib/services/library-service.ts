import axios from "axios";
import type { DigitalBook } from "@prisma/client";
import { ApiResponse, PaginatedData } from "@/lib/api-response";

export interface BookListParams {
  page?: number;
  limit?: number;
  category?: string;
  format?: string;
  search?: string;
  sort?: "newest" | "oldest" | "rating" | "popular" | "downloads";
  featured?: boolean;
}

export async function getBooks(
  params?: BookListParams
): Promise<PaginatedData<DigitalBook>> {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
        : "http://localhost:3000";

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.category) queryParams.set("category", params.category);
    if (params?.format) queryParams.set("format", params.format);
    if (params?.search) queryParams.set("search", params.search);
    if (params?.sort) queryParams.set("sort", params.sort);
    if (params?.featured !== undefined)
      queryParams.set("featured", params.featured.toString());

    const url = `${baseUrl}/api/library${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const { data } = await axios.get<ApiResponse<PaginatedData<DigitalBook>>>(
      url
    );

    if (data.status === "success") {
      return data.data as PaginatedData<DigitalBook>;
    }

    throw new Error("Failed to fetch books");
  } catch (error) {
    console.error("Error fetching books:", error);
    throw new Error("Failed to fetch books");
  }
}

export async function getBookById(id: string): Promise<DigitalBook> {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
        : "http://localhost:3000";

    const { data } = await axios.get<ApiResponse<DigitalBook>>(
      `${baseUrl}/api/library/${id}`
    );

    if (data.status === "success") {
      return data.data as DigitalBook;
    }

    throw new Error("Failed to fetch book");
  } catch (error) {
    console.error("Error fetching book:", error);
    throw new Error("Failed to fetch book");
  }
}

export async function createBook(
  bookData: Partial<DigitalBook>
): Promise<DigitalBook> {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
        : "http://localhost:3000";

    const { data } = await axios.post<ApiResponse<DigitalBook>>(
      `${baseUrl}/api/library`,
      bookData
    );

    if (data.status === "success") {
      return data.data as DigitalBook;
    }

    throw new Error("Failed to create book");
  } catch (error) {
    console.error("Error creating book:", error);
    throw new Error("Failed to create book");
  }
}
