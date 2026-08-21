import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSession, hasPermission } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !(await hasPermission(session, 'prompts:view'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const client = await clientPromise;
    const db = client.db();
    const promptsCollection = db.collection('prompts');

    const filter: any = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      const sanitized = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { prompt: { $regex: sanitized, $options: 'i' } },
        { authorName: { $regex: sanitized, $options: 'i' } },
        { authorEmail: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const prompts = await promptsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(prompts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
