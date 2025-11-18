// @/lib/services/image-service.ts
import { prisma } from "@/lib/prisma";
import {
  uploadFileToStorage,
  deleteFileFromStorage,
  generateSignedDownloadUrl,
} from "./object-storage-service";
import { ImageCategory } from "@prisma/client";
import crypto from "crypto";
import sharp from "sharp";

const IMAGES_FOLDER = "images"; // پوشه اصلی تصاویر

/**
 * تولید شناسه یکتا برای تصویر
 */
export function generateImageId(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * تولید نام فایل منحصر به فرد
 */
export function generateUniqueImageFileName(
  imageId: string,
  originalFileName: string
): string {
  const extension = originalFileName.split(".").pop()?.toLowerCase() || "jpg";
  const timestamp = Date.now();
  return `${imageId}_${timestamp}.${extension}`;
}

/**
 * تولید مسیر فایل در storage
 */
export function getImageStoragePath(
  category: ImageCategory,
  fileName: string
): string {
  return `${IMAGES_FOLDER}/${category.toLowerCase()}/${fileName}`;
}

/**
 * اعتبارسنجی نوع فایل تصویر
 */
export function isValidImageMimeType(mimeType: string): boolean {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  return validTypes.includes(mimeType.toLowerCase());
}

/**
 * اعتبارسنجی حجم فایل (حداکثر 10MB)
 */
export function isValidImageSize(
  fileSize: number,
  maxSizeMB: number = 10
): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return fileSize <= maxBytes;
}

/**
 * دریافت ابعاد تصویر
 */
export async function getImageDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number } | null> {
  try {
    const metadata = await sharp(buffer).metadata();
    if (metadata.width && metadata.height) {
      return { width: metadata.width, height: metadata.height };
    }
    return null;
  } catch (error) {
    console.error("Error getting image dimensions:", error);
    return null;
  }
}

/**
 * آپلود تصویر به storage و ذخیره در دیتابیس
 */
export async function uploadImage(params: {
  userId: string;
  file: File;
  category: ImageCategory;
  title?: string;
  description?: string;
  alt?: string;
  tags?: string[];
}): Promise<{
  id: string;
  filePath: string;
  fileName: string;
  url: string;
}> {
  const { userId, file, category, title, description, alt, tags } = params;

  // اعتبارسنجی نوع فایل
  if (!isValidImageMimeType(file.type)) {
    throw new Error("فرمت فایل مجاز نیست. فقط JPG، PNG، GIF، WEBP و SVG مجاز است.");
  }

  // اعتبارسنجی حجم فایل
  if (!isValidImageSize(file.size)) {
    throw new Error("حجم فایل بیش از حد مجاز است. حداکثر 10MB مجاز است.");
  }

  // تبدیل File به Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // دریافت ابعاد تصویر
  const dimensions = await getImageDimensions(buffer);

  // تولید شناسه و نام فایل
  const imageId = generateImageId();
  const fileName = generateUniqueImageFileName(imageId, file.name);
  const filePath = getImageStoragePath(category, fileName);

  // آپلود به storage
  await uploadFileToStorage(filePath, buffer, file.type);

  // ذخیره در دیتابیس
  const image = await prisma.image.create({
    data: {
      uploadedById: userId,
      fileName: file.name,
      filePath,
      fileSize: file.size,
      mimeType: file.type,
      width: dimensions?.width,
      height: dimensions?.height,
      category,
      title,
      description,
      alt,
      tags: tags || [],
      published: true,
    },
  });

  // تولید URL با امضا
  const url = await generateSignedDownloadUrl(filePath, 3600); // 1 ساعت

  return {
    id: image.id,
    filePath: image.filePath,
    fileName: image.fileName,
    url,
  };
}

/**
 * دریافت لیست تصاویر کاربر
 */
export async function getUserImages(params: {
  userId: string;
  category?: ImageCategory;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { userId, category, search, page = 1, limit = 20 } = params;
  const skip = (page - 1) * limit;

  const where: {
    uploadedById: string;
    category?: ImageCategory;
    OR?: Array<{
      title?: { contains: string; mode: "insensitive" };
      description?: { contains: string; mode: "insensitive" };
      fileName?: { contains: string; mode: "insensitive" };
    }>;
  } = {
    uploadedById: userId,
  };

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { fileName: { contains: search, mode: "insensitive" } },
    ];
  }

  const [images, total] = await Promise.all([
    prisma.image.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        alt: true,
        fileName: true,
        filePath: true,
        fileSize: true,
        mimeType: true,
        width: true,
        height: true,
        category: true,
        tags: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.image.count({ where }),
  ]);

  // تولید URL با امضا برای هر تصویر
  const imagesWithUrls = await Promise.all(
    images.map(async (image) => {
      const url = await generateSignedDownloadUrl(image.filePath, 3600);
      return {
        ...image,
        url,
      };
    })
  );

  return {
    images: imagesWithUrls,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * دریافت تصویر با شناسه
 */
export async function getImageById(imageId: string, userId: string) {
  const image = await prisma.image.findFirst({
    where: {
      id: imageId,
      uploadedById: userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      alt: true,
      fileName: true,
      filePath: true,
      fileSize: true,
      mimeType: true,
      width: true,
      height: true,
      category: true,
      tags: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!image) {
    return null;
  }

  // تولید URL با امضا
  const url = await generateSignedDownloadUrl(image.filePath, 3600);

  return {
    ...image,
    url,
  };
}

/**
 * حذف تصویر
 */
export async function deleteImage(imageId: string, userId: string) {
  const image = await prisma.image.findFirst({
    where: {
      id: imageId,
      uploadedById: userId,
    },
  });

  if (!image) {
    throw new Error("تصویر یافت نشد");
  }

  // حذف از storage
  try {
    await deleteFileFromStorage(image.filePath);
  } catch (error) {
    console.error("Error deleting file from storage:", error);
    // ادامه می‌دهیم تا حداقل از دیتابیس حذف شود
  }

  // حذف از دیتابیس
  await prisma.image.delete({
    where: { id: imageId },
  });

  return { success: true };
}

/**
 * به‌روزرسانی اطلاعات تصویر
 */
export async function updateImage(params: {
  imageId: string;
  userId: string;
  title?: string;
  description?: string;
  alt?: string;
  tags?: string[];
  category?: ImageCategory;
  published?: boolean;
}) {
  const { imageId, userId, ...updateData } = params;

  const image = await prisma.image.findFirst({
    where: {
      id: imageId,
      uploadedById: userId,
    },
  });

  if (!image) {
    throw new Error("تصویر یافت نشد");
  }

  const updatedImage = await prisma.image.update({
    where: { id: imageId },
    data: updateData,
  });

  // تولید URL با امضا
  const url = await generateSignedDownloadUrl(updatedImage.filePath, 3600);

  return {
    ...updatedImage,
    url,
  };
}

/**
 * دریافت آمار تصاویر کاربر
 */
export async function getUserImageStats(userId: string) {
  const [total, byCategory, totalSize] = await Promise.all([
    // تعداد کل تصاویر
    prisma.image.count({
      where: { uploadedById: userId },
    }),
    // تعداد به تفکیک دسته
    prisma.image.groupBy({
      by: ["category"],
      where: { uploadedById: userId },
      _count: true,
    }),
    // حجم کل
    prisma.image.aggregate({
      where: { uploadedById: userId },
      _sum: {
        fileSize: true,
      },
    }),
  ]);

  return {
    total,
    byCategory: byCategory.map((item) => ({
      category: item.category,
      count: item._count,
    })),
    totalSize: totalSize._sum.fileSize || 0,
  };
}
