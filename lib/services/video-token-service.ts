// @/lib/services/video-token-service.ts
import crypto from "crypto";
import type { StreamToken } from "@/types/video";

/**
 * کلید مخفی برای امضای توکن‌ها
 * در production باید از environment variable استفاده شود
 */
const TOKEN_SECRET = process.env.VIDEO_TOKEN_SECRET || "your-secret-key-here";

/**
 * مدت اعتبار پیش‌فرض توکن (به ثانیه)
 */
const DEFAULT_TOKEN_EXPIRY = 30; // 30 ثانیه

/**
 * تولید توکن امن برای پخش ویدیو
 * این توکن کوتاه‌مدت است و فقط برای یک ویدیو و یک کاربر معتبر است
 */
export function generateStreamToken(
  videoId: string,
  userId?: string,
  expirySeconds: number = DEFAULT_TOKEN_EXPIRY
): StreamToken {
  const expiresAt = Date.now() + expirySeconds * 1000;

  // ساخت payload
  const payload = {
    videoId,
    userId: userId || "anonymous",
    expiresAt,
    timestamp: Date.now(),
  };

  // تبدیل payload به JSON و سپس به base64
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  // ساخت signature با HMAC SHA256
  const signature = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  // ترکیب payload و signature
  const token = `${payloadBase64}.${signature}`;

  return {
    token,
    videoId,
    userId,
    expiresAt,
  };
}

/**
 * اعتبارسنجی توکن پخش ویدیو
 * بررسی می‌کند که توکن معتبر، منقضی نشده و برای ویدیوی صحیح باشد
 */
export function verifyStreamToken(
  token: string,
  videoId: string
): {
  valid: boolean;
  userId?: string;
  error?: string;
} {
  try {
    // جدا کردن payload و signature
    const parts = token.split(".");
    if (parts.length !== 2) {
      return { valid: false, error: "فرمت توکن نامعتبر است" };
    }

    const [payloadBase64, signature] = parts;

    // بررسی signature
    const expectedSignature = crypto
      .createHmac("sha256", TOKEN_SECRET)
      .update(payloadBase64)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return { valid: false, error: "امضای توکن نامعتبر است" };
    }

    // استخراج payload
    const payloadJson = Buffer.from(payloadBase64, "base64url").toString(
      "utf-8"
    );
    const payload = JSON.parse(payloadJson);

    // بررسی انقضا
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: "توکن منقضی شده است" };
    }

    // بررسی videoId
    if (payload.videoId !== videoId) {
      return { valid: false, error: "توکن برای این ویدیو معتبر نیست" };
    }

    return {
      valid: true,
      userId: payload.userId !== "anonymous" ? payload.userId : undefined,
    };
  } catch (error) {
    console.error("Error verifying stream token:", error);
    return { valid: false, error: "خطا در اعتبارسنجی توکن" };
  }
}

/**
 * تولید توکن برای segment های HLS
 * این توکن‌ها کوتاه‌مدت‌تر هستند (10 ثانیه)
 */
export function generateSegmentToken(
  videoId: string,
  segmentPath: string,
  userId?: string
): string {
  const expiresAt = Date.now() + 10 * 1000; // 10 ثانیه

  const payload = {
    videoId,
    segmentPath,
    userId: userId || "anonymous",
    expiresAt,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  const signature = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * اعتبارسنجی توکن segment
 */
export function verifySegmentToken(
  token: string,
  videoId: string,
  segmentPath: string
): {
  valid: boolean;
  error?: string;
} {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) {
      return { valid: false, error: "فرمت توکن نامعتبر است" };
    }

    const [payloadBase64, signature] = parts;

    // بررسی signature
    const expectedSignature = crypto
      .createHmac("sha256", TOKEN_SECRET)
      .update(payloadBase64)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return { valid: false, error: "امضای توکن نامعتبر است" };
    }

    const payloadJson = Buffer.from(payloadBase64, "base64url").toString(
      "utf-8"
    );
    const payload = JSON.parse(payloadJson);

    // بررسی انقضا
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: "توکن منقضی شده است" };
    }

    // بررسی videoId و segmentPath
    if (payload.videoId !== videoId || payload.segmentPath !== segmentPath) {
      return { valid: false, error: "توکن برای این segment معتبر نیست" };
    }

    return { valid: true };
  } catch (error) {
    console.error("Error verifying segment token:", error);
    return { valid: false, error: "خطا در اعتبارسنجی توکن" };
  }
}

/**
 * تولید توکن یکبار مصرف برای دانلود
 * این توکن فقط یک بار قابل استفاده است
 */
const usedTokens = new Set<string>();

export function generateDownloadToken(
  videoId: string,
  userId?: string
): string {
  const expiresAt = Date.now() + 60 * 1000; // 1 دقیقه

  const nonce = crypto.randomBytes(8).toString("hex");

  const payload = {
    videoId,
    userId: userId || "anonymous",
    expiresAt,
    nonce,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  const signature = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * اعتبارسنجی و مصرف توکن دانلود
 * توکن بعد از یک بار استفاده غیرفعال می‌شود
 */
export function verifyAndConsumeDownloadToken(
  token: string,
  videoId: string
): {
  valid: boolean;
  userId?: string;
  error?: string;
} {
  try {
    // بررسی اینکه توکن قبلاً استفاده نشده باشد
    if (usedTokens.has(token)) {
      return { valid: false, error: "توکن قبلاً استفاده شده است" };
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
      return { valid: false, error: "فرمت توکن نامعتبر است" };
    }

    const [payloadBase64, signature] = parts;

    const expectedSignature = crypto
      .createHmac("sha256", TOKEN_SECRET)
      .update(payloadBase64)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return { valid: false, error: "امضای توکن نامعتبر است" };
    }

    const payloadJson = Buffer.from(payloadBase64, "base64url").toString(
      "utf-8"
    );
    const payload = JSON.parse(payloadJson);

    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: "توکن منقضی شده است" };
    }

    if (payload.videoId !== videoId) {
      return { valid: false, error: "توکن برای این ویدیو معتبر نیست" };
    }

    // علامت‌گذاری توکن به عنوان استفاده شده
    usedTokens.add(token);

    // پاکسازی توکن‌های منقضی (برای جلوگیری از memory leak)
    setTimeout(() => {
      usedTokens.delete(token);
    }, 60 * 60 * 1000); // 1 ساعت

    return {
      valid: true,
      userId: payload.userId !== "anonymous" ? payload.userId : undefined,
    };
  } catch (error) {
    console.error("Error verifying download token:", error);
    return { valid: false, error: "خطا در اعتبارسنجی توکن" };
  }
}
