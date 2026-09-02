import { NextRequest, NextResponse } from 'next/server';
import { validateAndRotateRefreshToken, setAuthCookies, clearAuthCookies, REFRESH_COOKIE_NAME } from '@/lib/auth';
import { getFriendlyErrorMessage } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;
    
    let bodyToken: string | undefined;
    try {
      const body = await req.json().catch(() => ({}));
      bodyToken = body?.refreshToken;
    } catch {}

    const tokenToValidate = cookieToken || bodyToken;

    if (!tokenToValidate) {
      const res = NextResponse.json(
        { error: 'No refresh token provided. Please sign in again.' },
        { status: 401 }
      );
      clearAuthCookies(res);
      return res;
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const result = await validateAndRotateRefreshToken(tokenToValidate, { userAgent, ip });

    if (!result) {
      const res = NextResponse.json(
        { error: 'Session expired or invalidated. Please sign in again.' },
        { status: 401 }
      );
      clearAuthCookies(res);
      return res;
    }

    const res = NextResponse.json({
      message: 'Session refreshed successfully',
      user: {
        id: result.sessionPayload.userId,
        name: result.sessionPayload.name,
        email: result.sessionPayload.email,
        role: result.sessionPayload.role,
        status: result.sessionPayload.status,
        permissions: result.sessionPayload.permissions,
      },
    });

    // Set updated Access Token (15m) + Rotated Refresh Token (7d)
    setAuthCookies(res, result.accessToken, result.newRefreshToken);

    return res;
  } catch (error) {
    console.error('Refresh token API error:', error);
    const friendlyMessage = getFriendlyErrorMessage(error);
    const res = NextResponse.json({ error: friendlyMessage }, { status: 500 });
    clearAuthCookies(res);
    return res;
  }
}
