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

/**
 * Admin Authentication Helper for API Routes
 * Supports both NextAuth session and Bearer token
 * 
 * استفاده:
 * const adminAuth = await getAdminAuth(req);
 * if (!adminAuth) {
 *   return unauthorizedResponse('Unauthorized');
 * }
 */
export async function getAdminAuth(req: Request): Promise<AuthUser | null> {
  // Try to import NextAuth dynamically (to avoid circular dependencies)
  try {
    const { auth } = await import('@/auth');
    
    // Method 1: Try NextAuth session first
    const session = await auth();
    if (session?.user) {
      const user = session.user as any;
      if (user.role === 'ADMIN') {
        return {
          id: user.id || '',
          phone: user.phone || '',
          role: 'ADMIN',
        };
      }
    }
  } catch (error) {
    // NextAuth failed, continue to Bearer token
    console.debug('NextAuth session not available, checking Bearer token');
  }

  // Method 2: Try Bearer token from Authorization header
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const user = verifyToken(token);
    if (user?.role === 'ADMIN') {
      return user;
    }
  }

  // No valid authentication found
  return null;
}
