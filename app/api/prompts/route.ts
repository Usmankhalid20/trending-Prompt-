import { getMongoClient } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';
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
    return apiErrorResponse({
      status: 500,
      code: 'PROMPTS_FETCH_FAILED',
      userMessage: "We couldn't load prompts right now. Please try again in a moment.",
      developerMessage: 'Failed to fetch prompts from MongoDB.',
      error,
      context: 'Error fetching prompts',
    });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return apiErrorResponse({
      status: 401,
      code: 'UNAUTHORIZED',
      userMessage: 'You need to sign in as an admin to create prompts.',
      developerMessage: 'Missing or invalid admin session.',
      context: 'Prompt create unauthorized',
    });
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
    return apiErrorResponse({
      status: 500,
      code: 'PROMPT_CREATE_FAILED',
      userMessage: 'We could not save that prompt. Please try again.',
      developerMessage: 'Failed to insert prompt into MongoDB.',
      error,
      context: 'Error creating prompt',
    });
  }
}
