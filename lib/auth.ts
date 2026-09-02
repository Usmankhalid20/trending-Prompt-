import { SignJWT, jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { hashPassword } from '@/lib/password';
import { DEFAULT_ROLE_PERMISSIONS, Permission } from '@/lib/models/role';
import { UserRole, UserStatus } from '@/lib/models/user';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing in production environment.');
}

const secretKey = process.env.JWT_SECRET || 'ai-prompt-hub-development-jwt-secret-key-2026';
const key = new TextEncoder().encode(secretKey);

export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes (in seconds)
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days (in seconds)

export const SESSION_COOKIE_NAME = 'session';
export const REFRESH_COOKIE_NAME = 'refreshToken';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  permissions: Permission[];
}

export interface RefreshTokenDocument {
  _id?: ObjectId;
  token: string;
  userId: ObjectId;
  expiresAt: Date;
  createdAt: Date;
  userAgent?: string;
  ip?: string;
  isRevoked: boolean;
  replacedByToken?: string;
}

/**
 * Encrypts session payload into a short-lived signed JWT (Access Token)
 */
export async function encryptPayload(payload: SessionPayload, expiresIn = '15m'): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

/**
 * Decrypts and verifies a JWT Access Token
 */
export async function decryptToken(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (e) {
    return null;
  }
}

export { decryptToken as decrypt };

/**
 * Creates and persists a cryptographically secure Refresh Token in the database
 */
export async function createRefreshToken(
  userId: string,
  metadata?: { userAgent?: string; ip?: string }
): Promise<string> {
  const rawToken = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000);

  try {
    const client = await clientPromise;
    const db = client.db();
    const refreshTokensCollection = db.collection<RefreshTokenDocument>('refresh_tokens');

    // Ensure TTL index for automated MongoDB cleanup
    await refreshTokensCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => {});
    await refreshTokensCollection.createIndex({ token: 1 }, { unique: true }).catch(() => {});
    await refreshTokensCollection.createIndex({ userId: 1 }).catch(() => {});

    await refreshTokensCollection.insertOne({
      token: rawToken,
      userId: new ObjectId(userId),
      expiresAt,
      createdAt: new Date(),
      userAgent: metadata?.userAgent,
      ip: metadata?.ip,
      isRevoked: false,
    });

    return rawToken;
  } catch (error) {
    console.error('Error creating refresh token in DB:', error);
    throw new Error('Failed to create refresh token.');
  }
}

/**
 * Validates, revokes old refresh token, and issues a rotated refresh token + access token
 */
export async function validateAndRotateRefreshToken(
  rawRefreshToken: string,
  metadata?: { userAgent?: string; ip?: string }
): Promise<{ sessionPayload: SessionPayload; accessToken: string; newRefreshToken: string } | null> {
  if (!rawRefreshToken || typeof rawRefreshToken !== 'string') return null;

  try {
    const client = await clientPromise;
    const db = client.db();
    const refreshTokensCollection = db.collection<RefreshTokenDocument>('refresh_tokens');
    const usersCollection = db.collection('users');
    const rolesCollection = db.collection('roles');

    const tokenDoc = await refreshTokensCollection.findOne({ token: rawRefreshToken });

    if (!tokenDoc) {
      return null;
    }

    // Reuse detection: If token was already revoked, invalidate all user sessions for safety!
    if (tokenDoc.isRevoked) {
      console.warn(`[Security Alert] Reused refresh token detected for userId: ${tokenDoc.userId}. Revoking all sessions.`);
      await refreshTokensCollection.updateMany(
        { userId: tokenDoc.userId },
        { $set: { isRevoked: true } }
      );
      return null;
    }

    // Check expiry
    if (new Date() > tokenDoc.expiresAt) {
      await refreshTokensCollection.updateOne({ _id: tokenDoc._id }, { $set: { isRevoked: true } });
      return null;
    }

    // Find User
    const user = await usersCollection.findOne({ _id: tokenDoc.userId });
    if (!user || user.status === 'suspended') {
      await refreshTokensCollection.updateOne({ _id: tokenDoc._id }, { $set: { isRevoked: true } });
      return null;
    }

    // Generate new rotated refresh token
    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000);

    // Invalidate old token and record replacement
    await refreshTokensCollection.updateOne(
      { _id: tokenDoc._id },
      { $set: { isRevoked: true, replacedByToken: newRefreshToken } }
    );

    // Insert new rotated token
    await refreshTokensCollection.insertOne({
      token: newRefreshToken,
      userId: tokenDoc.userId,
      expiresAt: newExpiresAt,
      createdAt: new Date(),
      userAgent: metadata?.userAgent || tokenDoc.userAgent,
      ip: metadata?.ip || tokenDoc.ip,
      isRevoked: false,
    });

    // Fetch dynamic permissions
    let permissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
    if (user.role !== 'super_admin' && user.role !== 'user' && user.role !== 'creator') {
      const dbRole = await rolesCollection.findOne({ key: user.role });
      if (dbRole?.permissions) {
        permissions = dbRole.permissions;
      }
    }

    const sessionPayload: SessionPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status || 'active',
      permissions,
    };

    const accessToken = await encryptPayload(sessionPayload, '15m');

    return {
      sessionPayload,
      accessToken,
      newRefreshToken,
    };
  } catch (error) {
    console.error('Error validating & rotating refresh token:', error);
    return null;
  }
}

/**
 * Revokes a single refresh token on user logout
 */
export async function revokeRefreshToken(rawRefreshToken: string): Promise<void> {
  if (!rawRefreshToken) return;
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection('refresh_tokens').updateOne(
      { token: rawRefreshToken },
      { $set: { isRevoked: true } }
    );
  } catch (error) {
    console.error('Error revoking refresh token:', error);
  }
}

/**
 * Revokes all active refresh tokens for a user (e.g., password change or account compromise)
 */
export async function revokeAllUserRefreshTokens(userId: string): Promise<void> {
  if (!userId) return;
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection('refresh_tokens').updateMany(
      { userId: new ObjectId(userId) },
      { $set: { isRevoked: true } }
    );
  } catch (error) {
    console.error('Error revoking all user tokens:', error);
  }
}

/**
 * Attaches both session (15m) and refreshToken (7d) cookies to a Next.js response
 */
export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  const isProduction = process.env.NODE_ENV === 'production';

  // 1. Short-lived Access Token Cookie (15 mins)
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: accessToken,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  // 2. Long-lived Refresh Token Cookie (7 days)
  res.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: refreshToken,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

/**
 * Clears both session and refresh token cookies from response
 */
export function clearAuthCookies(res: NextResponse): void {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });

  res.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });
}

/**
 * Retrieves and validates the current active user session.
 * Supports both Authorization: Bearer <token> (Mobile Apps) and HttpOnly Cookie (Web).
 */
export async function getSession(): Promise<SessionPayload | null> {
  // 1. Check Authorization Bearer header (Mobile App / API Clients)
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization') || headersList.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const bearerToken = authHeader.substring(7).trim();
      if (bearerToken) {
        const payload = await decryptToken(bearerToken);
        if (payload) return payload;
      }
    }
  } catch (e) {
    // Non-fatal, proceed to cookie inspection
  }

  // 2. Fallback to HttpOnly session cookie (Web Browsers)
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return null;
  return await decryptToken(sessionToken);
}

export async function hasPermission(
  session: SessionPayload | null,
  requiredPermission: Permission
): Promise<boolean> {
  if (!session) return false;
  if (session.role === 'super_admin') return true;
  return session.permissions?.includes(requiredPermission) || false;
}

/**
 * Ensures initial Super Admin and default system role definitions exist in database.
 */
export async function ensureSuperAdmin() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    const rolesCollection = db.collection('roles');

    // Seed default roles if missing
    const existingRolesCount = await rolesCollection.countDocuments();
    if (existingRolesCount === 0) {
      const defaultRoles = [
        { key: 'super_admin', name: 'Super Admin', permissions: DEFAULT_ROLE_PERMISSIONS.super_admin, isSystem: true },
        { key: 'senior_admin', name: 'Senior Admin', permissions: DEFAULT_ROLE_PERMISSIONS.senior_admin, isSystem: true },
        { key: 'content_admin', name: 'Content Admin', permissions: DEFAULT_ROLE_PERMISSIONS.content_admin, isSystem: true },
        { key: 'moderator', name: 'Moderator', permissions: DEFAULT_ROLE_PERMISSIONS.moderator, isSystem: true },
      ];
      await rolesCollection.insertMany(defaultRoles);
    }

    // Seed default Super Admin user if missing
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@aiprompthub.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';

    const superAdminExists = await usersCollection.findOne({
      $or: [{ role: 'super_admin' }, { email: adminEmail.toLowerCase() }],
    });

    if (!superAdminExists) {
      await usersCollection.insertOne({
        name: 'System Super Admin',
        email: adminEmail.toLowerCase(),
        password: hashPassword(adminPassword),
        role: 'super_admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`[Auto-Seed] Initial Super Admin created with email: ${adminEmail}`);
    }
  } catch (error) {
    console.error('[Auto-Seed Error]:', error);
  }
}
