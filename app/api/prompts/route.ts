import { getMongoClient } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    
    let query = { visible: true };
    
    if (all) {
      const session = await getSession();
      if (session) {
        query = {} as any;
      }
    }

    const client = await getMongoClient();
    const db = client.db();
    const prompts = await db
      .collection('prompts')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const client = await getMongoClient();
    const db = client.db();

    const newPrompt = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('prompts').insertOne(newPrompt);

    return NextResponse.json({ ...newPrompt, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
