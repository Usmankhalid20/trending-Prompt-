import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSession, hasPermission } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !(await hasPermission(session, 'settings:manage'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db();
    const settings = await db.collection('settings').findOne({ key: 'platform_config' });

    return NextResponse.json(
      settings?.data || {
        siteName: 'AI Prompt Hub',
        requireAdminApproval: true,
        allowPublicRegistration: true,
        maintenanceMode: false,
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !(await hasPermission(session, 'settings:manage'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const config = await req.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection('settings').updateOne(
      { key: 'platform_config' },
      { $set: { key: 'platform_config', data: config, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Platform settings updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
