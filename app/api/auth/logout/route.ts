import { logout } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  await logout();
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: 'session',
    value: '',
    expires: new Date(0),
    path: '/',
  });
  return response;
}
