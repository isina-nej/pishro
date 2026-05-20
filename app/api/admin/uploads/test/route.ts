import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("[DEBUG] Starting FormData parsing...");
    
    const formData = await req.formData();
    console.log("[DEBUG] FormData parsed successfully");
    
    const file = formData.get("file");
    const kind = formData.get("kind");
    
    console.log("[DEBUG] File:", file instanceof File ? `${file.name} (${file.size} bytes)` : "Not a File");
    console.log("[DEBUG] Kind:", kind);
    
    if (!(file instanceof File)) {
      return NextResponse.json({
        success: false,
        error: "File is not a File object",
        fileType: typeof file,
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      kind: kind,
      message: "FormData parsed successfully",
    });
  } catch (error) {
    console.error("[DEBUG] Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
