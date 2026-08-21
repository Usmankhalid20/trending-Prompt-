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

function toObjectId(id: string) {
  try { return new ObjectId(id); } catch { return null; }
}

/* ── GET /api/creator/prompts/[id] ── */
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireCreator();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const oid = toObjectId(id);
  if (!oid) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  const col = (await clientPromise).db().collection('prompts');
  const prompt = await col.findOne({ _id: oid, userId: session.userId });
  if (!prompt) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(prompt);
}

/* ── PUT /api/creator/prompts/[id] ── */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireCreator();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const oid = toObjectId(id);
  if (!oid) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  const col = (await clientPromise).db().collection('prompts');
  const existing = await col.findOne({ _id: oid, userId: session.userId });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (!['draft', 'rejected'].includes(existing.status)) {
    return NextResponse.json({ error: 'Only draft or rejected prompts can be edited' }, { status: 403 });
  }

  const { title, prompt, description, category, tags, image, submitForReview } = await req.json();

  const update: Record<string, any> = { updatedAt: new Date() };
  if (title?.trim())       update.title       = title.trim();
  if (prompt?.trim())      update.prompt      = prompt.trim();
  if (description != null) update.description = description.trim();
  if (category)            update.category    = category;
  if (image != null)       update.image       = image.trim();
  if (tags != null)        update.tags        = Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim()).filter(Boolean);
  if (submitForReview)     update.status      = 'pending';

  await col.updateOne({ _id: oid }, { $set: update });
  return NextResponse.json({ message: submitForReview ? 'Resubmitted for review' : 'Draft saved' });
}

/* ── DELETE /api/creator/prompts/[id] ── */
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireCreator();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const oid = toObjectId(id);
  if (!oid) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  const col = (await clientPromise).db().collection('prompts');
  const existing = await col.findOne({ _id: oid, userId: session.userId });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (existing.status !== 'draft') return NextResponse.json({ error: 'Only drafts can be deleted' }, { status: 403 });

  await col.deleteOne({ _id: oid });
  return NextResponse.json({ message: 'Deleted' });
}
