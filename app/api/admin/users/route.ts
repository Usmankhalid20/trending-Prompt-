import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSession, hasPermission } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !(await hasPermission(session, 'users:view'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const roleFilter = searchParams.get('role');

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const query: any = { role: 'user' }; // By default normal users

    if (roleFilter && roleFilter !== 'all') {
      query.role = roleFilter;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await usersCollection
      .find(query)
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, action } = await req.json();

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    const logsCollection = db.collection('activity_logs');

    const targetUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'suspend') {
      if (!(await hasPermission(session, 'users:suspend'))) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { status: 'suspended', updatedAt: new Date() } }
      );
    } else if (action === 'activate') {
      if (!(await hasPermission(session, 'users:suspend'))) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { status: 'active', updatedAt: new Date() } }
      );
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await logsCollection.insertOne({
      actorId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: `USER_${action.toUpperCase()}`,
      targetType: 'User',
      targetId: userId,
      details: `Admin ${session.email} executed ${action} on user ${targetUser.email}`,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: `User successfully ${action}d` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !(await hasPermission(session, 'users:delete'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

    await db.collection('activity_logs').insertOne({
      actorId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: 'USER_DELETED',
      targetType: 'User',
      targetId: userId,
      details: `Admin ${session.email} deleted user account ID ${userId}`,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: 'User deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
