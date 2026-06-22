import { login } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await login(body);

    if (result) {
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'session',
        value: result.session,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: result.expires,
      });
      return response;
    } else {
      return apiErrorResponse({
        status: 401,
        code: 'INVALID_CREDENTIALS',
        userMessage: 'The email address or password is incorrect.',
        developerMessage: 'Admin credentials did not match environment values.',
        context: 'Login rejected',
      });
    }
  } catch (error) {
    return apiErrorResponse({
      status: 500,
      code: 'LOGIN_FAILED',
      userMessage: 'We could not sign you in right now. Please try again.',
      developerMessage: 'Login route failed while validating credentials or creating a session.',
      error,
      context: 'Login API error',
    });
  }
}
