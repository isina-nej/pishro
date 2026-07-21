/**
 * Admin Panel Authentication Utilities
 * JWT-based authentication for admin users with separate token handling
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export function getAdminJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error('Missing ADMIN_JWT_SECRET or NEXTAUTH_SECRET');
  }

  return secret;
}

const ADMIN_TOKEN_EXPIRY = (process.env.ADMIN_TOKEN_EXPIRY || '24h') as StringValue;
const REFRESH_TOKEN_EXPIRY = (process.env.ADMIN_REFRESH_TOKEN_EXPIRY || '7d') as StringValue;

export interface AdminUser {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: 'ADMIN' | 'MODERATOR' | 'VIEWER';
}

export interface AdminAuthPayload extends AdminUser {
  type: 'access';
}

export interface AdminRefreshPayload {
  id: string;
  type: 'refresh';
}

export function createAdminAccessToken(user: AdminUser): string {
  const payload: AdminAuthPayload = {
    ...user,
    type: 'access',
  };

  const options: SignOptions = {
    expiresIn: ADMIN_TOKEN_EXPIRY,
  };
  return jwt.sign(payload, getAdminJwtSecret(), options);
}

export function createAdminRefreshToken(userId: string): string {
  const payload: AdminRefreshPayload = {
    id: userId,
    type: 'refresh',
  };

  const options: SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  };
  return jwt.sign(payload, getAdminJwtSecret(), options);
}

export function verifyAdminAccessToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, getAdminJwtSecret()) as AdminAuthPayload;
    
    if (decoded.type !== 'access') {
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      phone: decoded.phone,
    };
  } catch {
    return null;
  }
}

export function verifyAdminRefreshToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, getAdminJwtSecret()) as AdminRefreshPayload;
    
    if (decoded.type !== 'refresh') {
      return null;
    }

    return decoded.id;
  } catch {
    return null;
  }
}

export function getAdminAuthFromHeaders(headers: Headers): AdminUser | null {
  const authHeader = headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  return verifyAdminAccessToken(token);
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

export function getAdminAuthFromRequest(req: Request): AdminUser | null {
  const headerAuth = getAdminAuthFromHeaders(req.headers);
  if (headerAuth) {
    return headerAuth;
  }

  const cookieToken = getCookieValue(req.headers, 'admin_access_token');
  if (!cookieToken) {
    return null;
  }

  return verifyAdminAccessToken(cookieToken);
}

export async function hashAdminPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyAdminPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticateAdminUser(
  emailOrPhone: string,
  password: string
): Promise<{
  user: AdminUser | null;
  error?: string;
  code?: string;
}> {
  try {
    const isEmail = emailOrPhone.includes('@');
    
    const adminUser = await prisma.adminUser.findUnique({
      where: isEmail ? { email: emailOrPhone } : { phone: emailOrPhone },
    });

    if (!adminUser) {
      return {
        user: null,
        error: 'Email or password is incorrect',
        code: 'invalid_credentials',
      };
    }

    if (adminUser.status === 'INACTIVE') {
      return {
        user: null,
        error: 'This account is inactive',
        code: 'account_inactive',
      };
    }

    if (adminUser.status === 'SUSPENDED') {
      return {
        user: null,
        error: 'This account has been suspended',
        code: 'account_suspended',
      };
    }

    const isPasswordValid = await verifyAdminPassword(password, adminUser.passwordHash);

    if (!isPasswordValid) {
      return {
        user: null,
        error: 'Email or password is incorrect',
        code: 'invalid_credentials',
      };
    }

    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: adminUser.id,
        email: adminUser.email,
        phone: adminUser.phone || undefined,
        name: adminUser.name,
        role: adminUser.role as 'ADMIN' | 'MODERATOR' | 'VIEWER',
      },
    };
  } catch (error) {
    console.error('Error authenticating admin user:', error);
    return {
      user: null,
      error: 'An error occurred during authentication',
      code: 'auth_error',
    };
  }
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  try {
    const adminUser = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!adminUser) {
      return null;
    }

    if (adminUser.status !== 'ACTIVE') {
      return null;
    }

    return {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      phone: adminUser.phone || undefined,
      role: adminUser.role as 'ADMIN' | 'MODERATOR' | 'VIEWER',
    };
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
}
