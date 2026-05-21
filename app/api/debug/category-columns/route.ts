import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get first category with all possible data
    const categories = await query<any>(
      `SELECT * FROM Category LIMIT 1`
    );

    if (categories && categories.length > 0) {
      const keys = Object.keys(categories[0]);
      return NextResponse.json({ columns: keys });
    }

    return NextResponse.json({ columns: [], message: "No categories found" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
