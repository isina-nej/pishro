import { NextRequest } from "next/server";
import type { ZodSchema } from "zod";
import { getAdminAuthFromRequest } from "@/lib/admin-auth";
import {
  unauthorizedResponse,
  validationError,
} from "@/lib/api-response";

export function requireAdminUser(req: NextRequest) {
  const admin = getAdminAuthFromRequest(req);
  if (!admin) {
    return { admin: null, response: unauthorizedResponse("لطفا برای ادامه وارد شوید") };
  }
  return { admin, response: null };
}

export function parseZodBody<T>(schema: ZodSchema<T>, body: unknown) {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.errors.forEach((err) => {
      errors[err.path.join(".") || "_"] = err.message;
    });
    return {
      data: null as T | null,
      response: validationError(errors, "اطلاعات وارد شده معتبر نیست"),
    };
  }
  return { data: parsed.data, response: null };
}

/** Strip nulls so Prisma optional updates stay clean */
export function stripNulls<T extends Record<string, unknown>>(data: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) out[key] = value;
  }
  return out as Partial<T>;
}
