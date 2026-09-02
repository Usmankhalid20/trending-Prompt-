import { NextRequest, NextResponse } from 'next/server';
import { getSession, validateAndRotateRefreshToken, setAuthCookies, REFRESH_COOKIE_NAME } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    let session = await getSession();
    let rotatedAuth: { accessToken: string; newRefreshToken: string } | null = null;

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

    if (session) {
      const res = NextResponse.json({ authenticated: true, role: session.role, status: session.status });
      if (rotatedAuth) {
        setAuthCookies(res, rotatedAuth.accessToken, rotatedAuth.newRefreshToken);
      }
      return res;
    } else {
      return apiErrorResponse({
        status: 401,
        code: 'SESSION_INVALID',
        userMessage: 'Your session has expired. Please sign in again.',
        developerMessage: 'No valid session or refresh token found.',
        context: 'Session check failed',
      });
    }
  } catch (error) {
    return apiErrorResponse({
      status: 500,
      code: 'SESSION_CHECK_FAILED',
      userMessage: 'We could not verify your session right now.',
      developerMessage: 'Session check route failed.',
      error,
      context: 'Auth check API error',
    });
  }
}
