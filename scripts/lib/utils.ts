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
