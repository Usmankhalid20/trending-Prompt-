import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSession, hasPermission } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { UserStatus } from '@/lib/models/user';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canView =
      (await hasPermission(session, 'creators:view')) ||
      (await hasPermission(session, 'users:view')) ||
      session.role === 'super_admin';

    if (!canView) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const query: Record<string, any> = { role: 'creator' };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      const sanitized = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: sanitized, $options: 'i' } },
        { email: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const creators = await usersCollection
      .find(query)
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(creators);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { creatorId, action } = await req.json();

    if (!creatorId || !action) {
      return NextResponse.json({ error: 'creatorId and action are required' }, { status: 400 });
    }

    let requiredPermission = 'creators:view';
    let targetStatus: UserStatus = 'pending';

    if (action === 'approve') {
      requiredPermission = 'creators:approve';
      targetStatus = 'approved';
    } else if (action === 'reject') {
      requiredPermission = 'creators:reject';
      targetStatus = 'rejected';
    } else if (action === 'suspend') {
      requiredPermission = 'creators:suspend';
      targetStatus = 'suspended';
    } else if (action === 'activate') {
      requiredPermission = 'creators:approve';
      targetStatus = 'approved';
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const authorized =
      session.role === 'super_admin' || (await hasPermission(session, requiredPermission as any));

    if (!authorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');
    const logsCollection = db.collection('activity_logs');

    let oid: ObjectId;
    try {
      oid = new ObjectId(creatorId);
    } catch {
      return NextResponse.json({ error: 'Invalid creator ID' }, { status: 400 });
    }

    const creator = await usersCollection.findOne({ _id: oid, role: 'creator' });
    if (!creator) {
      return NextResponse.json({ error: 'Creator account not found' }, { status: 404 });
    }

    await usersCollection.updateOne(
      { _id: oid },
      { $set: { status: targetStatus, updatedAt: new Date() } }
    );

    await logsCollection.insertOne({
      actorId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: `CREATOR_${action.toUpperCase()}`,
      targetType: 'Creator',
      targetId: creatorId,
      details: `Admin ${session.email} executed action '${action}' setting status to '${targetStatus}' for creator ${creator.email}`,
      timestamp: new Date(),
    });

    return NextResponse.json({
      message: `Creator status updated to ${targetStatus}`,
      status: targetStatus,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
