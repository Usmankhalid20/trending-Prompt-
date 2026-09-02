import { NextRequest, NextResponse } from 'next/server';
import { revokeRefreshToken, clearAuthCookies, REFRESH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    const res = NextResponse.json({ message: 'Logged out successfully' });
    clearAuthCookies(res);
    return res;
  } catch (error) {
    console.error('Logout error:', error);
    const res = NextResponse.json({ message: 'Logged out' });
    clearAuthCookies(res);
    return res;
  }
}
