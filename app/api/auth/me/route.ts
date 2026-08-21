import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  const session = await getSession();
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

  return NextResponse.json({
    user: {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: freshRole,
      status: freshStatus,
      permissions: session.permissions || [],
    },
  });
}
