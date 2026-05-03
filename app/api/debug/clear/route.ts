import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest) {
  try {
    const result = await prisma.digitalBook.deleteMany({});
    
    return Response.json({
      message: "تمام کتاب‌ها حذف شدند",
      deleted: result.count,
    }, { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
