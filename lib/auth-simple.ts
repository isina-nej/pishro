// lib/auth-simple.ts
// Simple JWT-based authentication without Prisma
import jwt from 'jsonwebtoken';

const SECRET = process.env.NEXTAUTH_SECRET || 'default-secret';

export interface AuthUser {
  id: string;
  phone: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthSession {
  user?: AuthUser;
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Create JWT token
 */
export function createToken(user: AuthUser): string {
  return jwt.sign(user, SECRET, { expiresIn: '30d' });
}

/**
 * Get auth from headers
 */
export function getAuthFromHeaders(headers: Headers): AuthUser | null {
  const authHeader = headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  return verifyToken(token);
}
