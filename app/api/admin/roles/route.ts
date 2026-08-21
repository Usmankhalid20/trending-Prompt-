import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ALL_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS } from '@/lib/models/role';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db();
    const rolesCollection = db.collection('roles');

    const roles = await rolesCollection.find({}).toArray();

    return NextResponse.json({
      roles,
      allPermissions: ALL_PERMISSIONS,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { roleKey, permissions } = await req.json();
    if (!roleKey || !Array.isArray(permissions)) {
      return NextResponse.json({ error: 'roleKey and permissions array required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const rolesCollection = db.collection('roles');

    await rolesCollection.updateOne(
      { key: roleKey },
      { $set: { permissions, updatedAt: new Date() } },
      { upsert: true }
    );

    await db.collection('activity_logs').insertOne({
      actorId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: 'ROLE_PERMISSIONS_UPDATED',
      targetType: 'Role',
      targetId: roleKey,
      details: `Super Admin ${session.email} updated permissions for role ${roleKey}`,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: `Permissions for ${roleKey} updated` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
