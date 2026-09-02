import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyPassword } from '@/lib/password';
import { encryptPayload, createRefreshToken, setAuthCookies, ensureSuperAdmin } from '@/lib/auth';
import { DEFAULT_ROLE_PERMISSIONS } from '@/lib/models/role';
import { checkRateLimit } from '@/lib/rate-limit';
import { getFriendlyErrorMessage } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const rateLimit = checkRateLimit(`login:${ip}`, 5, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    // Ensure initial super admin exists (graceful if already initialized)
    try {
      await ensureSuperAdmin();
    } catch (e) {
      console.warn('ensureSuperAdmin skipped or database connecting...', e);
    }

    const { email, password } = await req.json();

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Please enter both your email address and password.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    const rolesCollection = db.collection('roles');

    const cleanEmail = email.toLowerCase().trim();
    const user = await usersCollection.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email address or password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    if (user.status === 'suspended') {
      return NextResponse.json(
        { error: 'Your account has been suspended. Please contact platform support.' },
        { status: 403 }
      );
    }

    const isValidPassword = verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email address or password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    // Update last login timestamp
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Fetch dynamic permissions for user's role
    let permissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
    if (user.role !== 'super_admin' && user.role !== 'user' && user.role !== 'creator') {
      const dbRole = await rolesCollection.findOne({ key: user.role });
      if (dbRole?.permissions) {
        permissions = dbRole.permissions;
      }
    }

    const userId = user._id.toString();
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // 1. Generate short-lived Access Token (15m)
    const accessToken = await encryptPayload({
      userId,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status || 'active',
      permissions,
    }, '15m');

    // 2. Generate and persist long-lived Refresh Token (7 days) in DB
    const refreshToken = await createRefreshToken(userId, { userAgent, ip });

    const res = NextResponse.json({
      message: 'Login successful',
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status || 'active',
        permissions,
      },
    });

    // 3. Set HttpOnly security cookies (session & refreshToken)
    setAuthCookies(res, accessToken, refreshToken);

    return res;
  } catch (error: any) {
    console.error('Login error:', error);
    const friendlyMessage = getFriendlyErrorMessage(error);
    return NextResponse.json(
      { error: friendlyMessage },
      { status: 500 }
    );
  }
}
