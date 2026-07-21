import type { NextRequest } from 'next/server';

const encoder = new TextEncoder();

function getAdminJwtSecret(): string | null {
  return process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET || null;
}

function base64UrlToBuffer(value: string): ArrayBuffer {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
  const base64 = normalized + padding;
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function decodePayload(token: string): { type?: string; exp?: number } | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const json = new TextDecoder().decode(base64UrlToBuffer(payload));
    return JSON.parse(json) as { type?: string; exp?: number };
  } catch {
    return null;
  }
}

async function verifySignature(token: string, secret: string): Promise<boolean> {
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  return crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlToBuffer(signature),
    encoder.encode(`${header}.${payload}`)
  );
}

export async function verifyAdminAccessTokenForMiddleware(token: string): Promise<boolean> {
  const secret = getAdminJwtSecret();
  if (!secret || !token) return false;

  const payload = decodePayload(token);
  if (!payload || payload.type !== 'access') return false;
  if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) return false;

  return verifySignature(token, secret);
}

export function getAdminTokenFromRequest(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('admin_access_token')?.value;
  if (cookieToken) return cookieToken;

  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return null;
}
