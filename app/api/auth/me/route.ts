import { NextRequest, NextResponse } from 'next/server';
import { getSession, validateAndRotateRefreshToken, setAuthCookies, REFRESH_COOKIE_NAME } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  let session = await getSession();
  let rotatedAuth: { accessToken: string; newRefreshToken: string } | null = null;

  // If Access Token is expired, attempt seamless server-side Refresh Token recovery
  if (!session) {
    const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;
    if (refreshToken) {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
      const userAgent = req.headers.get('user-agent') || 'unknown';
      const refreshResult = await validateAndRotateRefreshToken(refreshToken, { userAgent, ip });
      if (refreshResult) {
        session = refreshResult.sessionPayload;
        rotatedAuth = {
          accessToken: refreshResult.accessToken,
          newRefreshToken: refreshResult.newRefreshToken,
        };
      }
    }
  }

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  let freshStatus = session.status || 'active';
  let freshRole = session.role;

  try {
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.userId) });
    if (user) {
      if (user.status) freshStatus = user.status;
      if (user.role) freshRole = user.role;
    }
  } catch (e) {
    console.error('Error fetching fresh user status in /api/auth/me:', e);
  }

  const res = NextResponse.json({
    user: {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: freshRole,
      status: freshStatus,
      permissions: session.permissions || [],
    },
  });

  // If silent token rotation occurred, update response cookies
  if (rotatedAuth) {
    setAuthCookies(res, rotatedAuth.accessToken, rotatedAuth.newRefreshToken);
  }

  return res;
}
