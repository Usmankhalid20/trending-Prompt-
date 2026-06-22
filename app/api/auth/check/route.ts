import { getSession } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    if (session) {
      return NextResponse.json({ authenticated: true });
    } else {
      return apiErrorResponse({
        status: 401,
        code: 'SESSION_INVALID',
        userMessage: 'Your session has expired. Please sign in again.',
        developerMessage: 'No valid session cookie was found.',
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
