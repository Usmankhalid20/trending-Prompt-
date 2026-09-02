import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hashPassword } from '@/lib/password';
import { encryptPayload, createRefreshToken, setAuthCookies } from '@/lib/auth';
import { DEFAULT_ROLE_PERMISSIONS } from '@/lib/models/role';
import { UserStatus } from '@/lib/models/user';
import { checkRateLimit } from '@/lib/rate-limit';
import { getFriendlyErrorMessage } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const rateLimit = checkRateLimit(`register:${ip}`, 5, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const { name, email, password, role } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await usersCollection.findOne({ email: cleanEmail });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in instead.' },
        { status: 409 }
      );
    }

    // Only user & creator roles allowed through public registration
    const assignedRole: 'user' | 'creator' = role === 'creator' ? 'creator' : 'user';
    const assignedStatus: UserStatus = assignedRole === 'creator' ? 'pending' : 'active';

    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      password: hashPassword(password),
      role: assignedRole,
      status: assignedStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    const userId = result.insertedId.toString();

    const permissions = DEFAULT_ROLE_PERMISSIONS[assignedRole] ?? [];
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // 1. Generate short-lived Access Token (15m)
    const accessToken = await encryptPayload({
      userId,
      email: newUser.email,
      name: newUser.name,
      role: assignedRole,
      status: assignedStatus,
      permissions,
    }, '15m');

    // 2. Generate and persist long-lived Refresh Token (7 days) in DB
    const refreshToken = await createRefreshToken(userId, { userAgent, ip });

    const res = NextResponse.json(
      {
        message: assignedRole === 'creator' 
          ? 'Creator application submitted successfully. Pending admin approval.' 
          : 'Account created successfully',
        user: {
          id: userId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
        },
        accessToken,
        refreshToken,
      },
      { status: 201 }
    );

    // 3. Set HttpOnly security cookies (session & refreshToken)
    setAuthCookies(res, accessToken, refreshToken);

    return res;
  } catch (error: any) {
    console.error('Registration error:', error);
    const friendlyMessage = getFriendlyErrorMessage(error);
    return NextResponse.json(
      { error: friendlyMessage },
      { status: 500 }
    );
  }
}
