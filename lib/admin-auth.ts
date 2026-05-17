/**
 * Admin Panel Authentication Utilities
 * JWT-based authentication for admin users with separate token handling
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const ADMIN_SECRET: string = (process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET || 'admin-secret-key') as string;
const ADMIN_TOKEN_EXPIRY = (process.env.ADMIN_TOKEN_EXPIRY || '24h') as StringValue;
const REFRESH_TOKEN_EXPIRY = (process.env.ADMIN_REFRESH_TOKEN_EXPIRY || '7d') as StringValue;

export interface AdminUser {
  id: string;
  email: string;
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

/**
 * Create JWT access token for admin user
 */
export function createAdminAccessToken(user: AdminUser): string {
  const payload: AdminAuthPayload = {
    ...user,
    type: 'access',
  };

  const options: SignOptions = {
    expiresIn: ADMIN_TOKEN_EXPIRY,
  };
  return jwt.sign(payload, ADMIN_SECRET as string, options);
}

/**
 * Create JWT refresh token for admin user
 */
export function createAdminRefreshToken(userId: string): string {
  const payload: AdminRefreshPayload = {
    id: userId,
    type: 'refresh',
  };

  const options: SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  };
  return jwt.sign(payload, ADMIN_SECRET as string, options);
}

/**
 * Verify admin access token
 */
export function verifyAdminAccessToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, ADMIN_SECRET) as AdminAuthPayload;
    
    // Ensure this is an access token
    if (decoded.type !== 'access') {
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

/**
 * Verify admin refresh token
 */
export function verifyAdminRefreshToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, ADMIN_SECRET) as AdminRefreshPayload;
    
    // Ensure this is a refresh token
    if (decoded.type !== 'refresh') {
      return null;
    }

    return decoded.id;
  } catch {
    return null;
  }
}

/**
 * Get admin auth from request headers
 * Supports Authorization: Bearer <token> header
 */
export function getAdminAuthFromHeaders(headers: Headers): AdminUser | null {
  const authHeader = headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  return verifyAdminAccessToken(token);
}

/**
 * Hash admin password
 */
export async function hashAdminPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify admin password
 */
export async function verifyAdminPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Authenticate admin user with email and password
 */
export async function authenticateAdminUser(
  email: string,
  password: string
): Promise<{
  user: AdminUser | null;
  error?: string;
  code?: string;
}> {
  try {
    // Find admin user
    const adminUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!adminUser) {
      return {
        user: null,
        error: 'Email or password is incorrect',
        code: 'invalid_credentials',
      };
    }

    // Check status
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

    // Verify password
    const isPasswordValid = await verifyAdminPassword(password, adminUser.passwordHash);

    if (!isPasswordValid) {
      return {
        user: null,
        error: 'Email or password is incorrect',
        code: 'invalid_credentials',
      };
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: { lastLoginAt: new Date() },
    });

    // Return user data
    return {
      user: {
        id: adminUser.id,
        email: adminUser.email,
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

/**
 * Get admin user by ID
 */
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
      role: adminUser.role as 'ADMIN' | 'MODERATOR' | 'VIEWER',
    };
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
}
