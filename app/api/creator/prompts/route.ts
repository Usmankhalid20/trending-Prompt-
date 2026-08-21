import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';

async function requireCreator() {
  const session = await getSession();
  if (!session || session.role !== 'creator') return null;

  try {
    const client = await clientPromise;
    const user = await client.db().collection('users').findOne({ _id: new ObjectId(session.userId) });
    const currentStatus = user?.status || session.status;
    if (currentStatus !== 'approved' && currentStatus !== 'active') return null;
  } catch (e) {
    if (session.status !== 'approved' && session.status !== 'active') return null;
  }

  return session;
}

/* ── GET  /api/creator/prompts ── */
export async function GET(req: NextRequest) {
  const session = await requireCreator();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const client = await clientPromise;
  const col = client.db().collection('prompts');

  const query: Record<string, any> = { userId: session.userId };
  if (status && status !== 'all') query.status = status;

  const prompts = await col.find(query).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(prompts);
}

/* ── POST /api/creator/prompts ── */
export async function POST(req: NextRequest) {
  const session = await requireCreator();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, prompt, description, category, tags, image, submitForReview } = await req.json();

  if (!title?.trim() || !prompt?.trim()) {
    return NextResponse.json({ error: 'Title and prompt content are required' }, { status: 400 });
  }

  const client = await clientPromise;
  const col = client.db().collection('prompts');

  const doc = {
    userId:       session.userId,
    authorName:   session.name,
    authorEmail:  session.email,
    title:        title.trim(),
    prompt:       prompt.trim(),
    description:  description?.trim() ?? '',
    category:     category ?? 'General',
    image:        image?.trim() ?? '',
    tags:         Array.isArray(tags) ? tags : (tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean),
    status:       submitForReview ? 'pending' : 'draft',
    visible:      false,
    createdAt:    new Date(),
    updatedAt:    new Date(),
  };

  const result = await col.insertOne(doc);
  return NextResponse.json({ message: submitForReview ? 'Submitted for review' : 'Saved as draft', promptId: result.insertedId }, { status: 201 });
}
