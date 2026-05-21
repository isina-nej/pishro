import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test 1: Create a category directly
    const cat = await prisma.category.create({
      data: {
        slug: `test-${Date.now()}`,
        title: "Test Category",
        description: "Test",
      },
    });

    return NextResponse.json({
      success: true,
      category: cat,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}
