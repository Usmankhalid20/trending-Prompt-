import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');

    const client = await clientPromise;
    const db = client.db();
    const promptsCollection = db.collection('prompts');

    const query: any = {
      $or: [{ userId: session.userId }, { authorEmail: session.email }],
    };

    if (statusFilter && statusFilter !== 'all') {
      query.status = statusFilter;
    }

    const prompts = await promptsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(prompts);
  } catch (error: any) {
    console.error('Error fetching user prompts:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, prompt, category, aiModel, image, status } = await req.json();

    if (!title || !prompt) {
      return NextResponse.json(
        { error: 'Title and prompt text are required' },
        { status: 400 }
      );
    }

    const promptStatus = status === 'draft' ? 'draft' : 'pending';

    const client = await clientPromise;
    const db = client.db();
    const promptsCollection = db.collection('prompts');

    const newPrompt = {
      userId: session.userId,
      authorName: session.name,
      authorEmail: session.email,
      title: title.trim(),
      prompt: prompt.trim(),
      category: category || 'General',
      aiModel: aiModel || 'ChatGPT',
      image: image || '/placeholder-prompt.png',
      status: promptStatus,
      date: new Date().toISOString(),
      visible: false, // Only visible publicly when published
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await promptsCollection.insertOne(newPrompt);

    return NextResponse.json(
      {
        message:
          promptStatus === 'draft'
            ? 'Prompt saved as draft'
            : 'Prompt submitted for admin review',
        prompt: { ...newPrompt, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
