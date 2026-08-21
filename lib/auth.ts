import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hashPassword } from '@/lib/password';
import { DEFAULT_ROLE_PERMISSIONS, Permission } from '@/lib/models/role';
import { UserRole, UserStatus } from '@/lib/models/user';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing in production environment.');
}

const secretKey = process.env.JWT_SECRET || 'ai-prompt-hub-development-jwt-secret-key-2026';
const key = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  permissions: Permission[];
}

export async function encryptPayload(payload: SessionPayload) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

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

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
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
