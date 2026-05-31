// lib/auth-simple.ts
// Simple JWT-based authentication without Prisma
import jwt from 'jsonwebtoken';
import { verifyAdminAccessToken, type AdminUser } from './admin-auth';

const SECRET = process.env.NEXTAUTH_SECRET || 'default-secret';

export interface AuthUser {
  id: string;
  phone: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR' | 'VIEWER';
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
    console.log('[verifyToken] Successfully verified token for user:', decoded.id);
    return decoded;
  } catch (error) {
    console.error('[verifyToken] Token verification failed:', error instanceof Error ? error.message : error);
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

function getCookieValue(headers: Headers, name: string): string | null {
  const cookieHeader = headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  if (!match) {
    return null;
  }

  return decodeURIComponent(match.slice(name.length + 1));
}

function isAdminRole(role: AuthUser['role'] | AdminUser['role']): boolean {
  return role === 'ADMIN' || role === 'MODERATOR' || role === 'VIEWER';
}

function toAuthUser(user: AdminUser): AuthUser {
  return {
    id: user.id,
    phone: user.phone || '',
    role: user.role,
  };
}

/**
 * Admin Authentication Helper for API Routes.
 * Uses the dedicated admin JWT and avoids NextAuth session decryption.
 * 
 * استفاده:
 * const adminAuth = await getAdminAuth(req);
 * if (!adminAuth) {
 *   return unauthorizedResponse('Unauthorized');
 * }
 */
export async function getAdminAuth(req: Request): Promise<AuthUser | null> {
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);

    const adminUser = verifyAdminAccessToken(token);
    if (adminUser && isAdminRole(adminUser.role)) {
      return toAuthUser(adminUser);
    }

    const user = verifyToken(token);
    if (user && isAdminRole(user.role)) {
      return user;
    }
  }

  const cookieToken = getCookieValue(req.headers, 'admin_access_token');
  if (cookieToken) {
    const adminUser = verifyAdminAccessToken(cookieToken);
    if (adminUser && isAdminRole(adminUser.role)) {
      return toAuthUser(adminUser);
    }

    const user = verifyToken(cookieToken);
    if (user && isAdminRole(user.role)) {
      return user;
    }
  }

  // No valid authentication found
  return null;
}
