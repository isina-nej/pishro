import type { JsonValue } from '@prisma/client/runtime/library';

export function toStrArray(val: JsonValue): string[] {
  if (Array.isArray(val)) return val.filter(v => typeof v === 'string');
  if (typeof val === 'string') return [val];
  return [];
}

export function toStr(val: JsonValue): string | undefined {
  if (typeof val === 'string') return val;
  if (Array.isArray(val) && val.length && typeof val[0] === 'string') return val[0];
  return undefined;
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('fa-IR')
}

export function normalizeImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/${url}`
}
