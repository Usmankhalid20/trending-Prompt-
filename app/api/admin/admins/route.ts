import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSession, hasPermission } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !(await hasPermission(session, 'admins:view'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db();
    const admins = await db
      .collection('users')
      .find({ role: { $ne: 'user' } })
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(admins);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !(await hasPermission(session, 'admins:create'))) {
      return NextResponse.json({ error: 'Forbidden. Only Super Admin can create admins.' }, { status: 403 });
    }

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Name, email, password, and role are required' }, { status: 400 });
    }

    const validAdminRoles = ['super_admin', 'senior_admin', 'content_admin', 'moderator', 'admin'];
    if (!validAdminRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid admin role' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const existing = await usersCollection.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const newAdmin = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword(password),
      role,
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await usersCollection.insertOne(newAdmin);

    // Audit Log
    await db.collection('activity_logs').insertOne({
      actorId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: 'ADMIN_CREATED',
      targetType: 'Admin',
      targetId: res.insertedId.toString(),
      details: `Super Admin ${session.email} created new Admin ${email} with role ${role}`,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: 'Admin created successfully', id: res.insertedId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !(await hasPermission(session, 'admins:edit'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { adminId, role, status, newPassword } = await req.json();
    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const targetAdmin = await usersCollection.findOne({ _id: new ObjectId(adminId) });
    if (!targetAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Protect Super Admin from non-super-admin edits
    if (targetAdmin.role === 'super_admin' && session.role !== 'super_admin') {
      return NextResponse.json({ error: 'Cannot modify Super Admin account' }, { status: 403 });
    }

    const updates: any = { updatedAt: new Date() };
    if (role) updates.role = role;
    if (status) updates.status = status;
    if (newPassword) updates.password = hashPassword(newPassword);

    await usersCollection.updateOne({ _id: new ObjectId(adminId) }, { $set: updates });

    await db.collection('activity_logs').insertOne({
      actorId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: 'ADMIN_UPDATED',
      targetType: 'Admin',
      targetId: adminId,
      details: `Super Admin ${session.email} updated admin ${targetAdmin.email}`,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: 'Admin account updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !(await hasPermission(session, 'admins:delete'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get('id');
    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const targetAdmin = await usersCollection.findOne({ _id: new ObjectId(adminId) });
    if (!targetAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    if (targetAdmin.role === 'super_admin') {
      return NextResponse.json({ error: 'Super Admin cannot be deleted by an admin' }, { status: 403 });
    }

    await usersCollection.deleteOne({ _id: new ObjectId(adminId) });

    await db.collection('activity_logs').insertOne({
      actorId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: 'ADMIN_DELETED',
      targetType: 'Admin',
      targetId: adminId,
      details: `Super Admin ${session.email} deleted admin account ${targetAdmin.email}`,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
