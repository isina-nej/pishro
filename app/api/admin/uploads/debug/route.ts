import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const formData = await req.formData();
    const file = formData.get("file");
    
    return NextResponse.json({
      success: true,
      authHeader: authHeader ? `${authHeader.slice(0, 20)}...` : null,
      file: file instanceof File ? { name: file.name, size: file.size, type: file.type } : null,
      message: "Debug info",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
