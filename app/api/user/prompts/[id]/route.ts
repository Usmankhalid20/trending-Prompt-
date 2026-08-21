import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();
    const promptsCollection = db.collection('prompts');

    let query: any;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { id: parseInt(id, 10) };
    }

    const prompt = await promptsCollection.findOne(query);

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    if (prompt.userId !== session.userId && prompt.authorEmail !== session.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(prompt);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, prompt, category, aiModel, image, status } = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const promptsCollection = db.collection('prompts');

    let query: any;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { id: parseInt(id, 10) };
    }

    const existing = await promptsCollection.findOne(query);
    if (!existing) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    if (existing.userId !== session.userId && existing.authorEmail !== session.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (title) updateFields.title = title.trim();
    if (prompt) updateFields.prompt = prompt.trim();
    if (category) updateFields.category = category;
    if (aiModel) updateFields.aiModel = aiModel;
    if (image) updateFields.image = image;
    if (status) {
      updateFields.status = status === 'draft' ? 'draft' : 'pending';
    }

    await promptsCollection.updateOne(query, { $set: updateFields });

    return NextResponse.json({ message: 'Prompt updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();
    const promptsCollection = db.collection('prompts');

    let query: any;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { id: parseInt(id, 10) };
    }

    const existing = await promptsCollection.findOne(query);
    if (!existing) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    if (existing.userId !== session.userId && existing.authorEmail !== session.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await promptsCollection.deleteOne(query);

    return NextResponse.json({ message: 'Prompt deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
