import { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
    errorResponse,
    successResponse,
    unauthorizedResponse,
    forbiddenResponse,
    validationError,
    ErrorCodes,
} from "@/lib/api-response";
import { saveFileToStorage } from "@/lib/services/storage-adapter";
import { generateUniqueImageFileName, generateImageId } from "@/lib/services/image-service";

// Handle CORS preflight requests
export async function OPTIONS(_req: NextRequest) {
    return new Response(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Max-Age": "86400",
        },
    });
}

export async function POST(req: NextRequest) {
    try {
        // Debug logging for request headers
        const authHeader = req.headers.get('authorization');
        console.log("[Upload] Request headers - Authorization:", authHeader ? "present" : "missing");
        
        // Auth check - only admins
        const session = await auth();
        console.log("[Upload] Session result:", session ? "authenticated" : "not authenticated");
        
        if (!session?.user) {
            console.log("[Upload] No session user");
            return unauthorizedResponse("لطفا وارد شوید");
        }
        if (session.user.role !== "ADMIN") {
            console.log("[Upload] User role is not ADMIN:", session.user.role);
            return forbiddenResponse("دسترسی محدود به ادمین");
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const type = formData.get("type") as string | null;

        if (!file) {
            return validationError({ file: "فایل الزامی است" }, "فایل الزامی است");
        }

        if (!type || !["pdf", "image", "audio"].includes(type.toLowerCase())) {
            return validationError(
                { type: "نوع فایل نامعتبر است" },
                "نوع فایل باید یکی از موارد pdf, image, audio باشد"
            );
        }

        // Validate mime types based on requested type
        const mimeType = file.type.toLowerCase();
        const typeLower = type.toLowerCase();

        if (typeLower === "pdf" && mimeType !== "application/pdf") {
            return validationError({ file: "فرمت فایل نامعتبر است" }, "فایل باید PDF باشد");
        }

        if (typeLower === "image" && !mimeType.startsWith("image/")) {
            return validationError({ file: "فرمت فایل نامعتبر است" }, "فایل باید تصویر باشد");
        }

        if (typeLower === "audio" && !mimeType.startsWith("audio/")) {
            // Broad check for audio, some browsers send specific audio types
            return validationError({ file: "فرمت فایل نامعتبر است" }, "فایل باید صوتی باشد");
        }

        // Determine folder name (First letter capitalized as requested: Audio, Image, PDF)
        let folderName = "";
        const maxSizeMB = {
            image: 10,
            pdf: 200,
            audio: 200,
        } as const;

        // Enforce size limit based on type
        if (file.size > (maxSizeMB[typeLower as keyof typeof maxSizeMB] || 50) * 1024 * 1024) {
            return validationError({ file: "حجم فایل بیش از حد مجاز است" }, `حداکثر حجم برای ${typeLower} ${maxSizeMB[typeLower as keyof typeof maxSizeMB]}MB است`);
        }

        switch (typeLower) {
            case "pdf":
                folderName = "PDF";
                break;
            case "image":
                folderName = "Image";
                break;
            case "audio":
                folderName = "Audio";
                break;
            default:
                folderName = "Other";
        }

        // Generate unique filename
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Using image service helper for consistent naming or generic unique naming
        const uniqueId = generateImageId();
        // Validate extension matches expected types
        const extension = (file.name.split('.').pop() || '').toLowerCase();
        const allowedExtensionsByType: Record<string, string[]> = {
            image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
            pdf: ['pdf'],
            audio: ['mp3', 'wav', 'mpeg', 'ogg', 'aac', 'm4a'],
        };

        if (!allowedExtensionsByType[typeLower].includes(extension)) {
            return validationError({ file: 'پسوند فایل نامعتبر است' }, `پسوند فایل باید یکی از ${allowedExtensionsByType[typeLower].join(', ')} باشد`);
        }

        const fileName = generateUniqueImageFileName(uniqueId, file.name);

        // Path: books/{Type}/{filename}
        // Note: storage-adapter joins this with base path
        const relativePath = `books/${folderName}/${fileName}`;

        // Save
        const url = await saveFileToStorage(buffer, relativePath);

        return successResponse(
            { url, fileName, type: typeLower },
            "فایل با موفقیت آپلود شد"
        );

    } catch (error) {
        console.error("[Upload] Error uploading book file:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return errorResponse(
            `خطا در آپلود فایل: ${errorMessage}`,
            ErrorCodes.INTERNAL_ERROR
        );
    }
}
