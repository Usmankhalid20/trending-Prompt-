import { getMongoClient } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    const category = searchParams.get('category');
    const aiModel = searchParams.get('aiModel');
    const search = searchParams.get('search');
    
    let query: any = { visible: true };
    
    if (all) {
      const session = await getSession();
      if (session && session.role !== 'user') {
        query = {};
      }
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (aiModel && aiModel !== 'all') {
      query.aiModel = aiModel;
    }

    if (search) {
      const sanitized = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { prompt: { $regex: sanitized, $options: 'i' } },
        { category: { $regex: sanitized, $options: 'i' } },
        { aiModel: { $regex: sanitized, $options: 'i' } },
      ];
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
      userMessage: 'You need to sign in to submit a prompt.',
      developerMessage: 'Missing session token.',
      context: 'Prompt create unauthorized',
    });
  }

  try {
    const body = await request.json();
    const { title, prompt, category, aiModel, image } = body;

    if (!title?.trim() || !prompt?.trim()) {
      return apiErrorResponse({
        status: 400,
        code: 'INVALID_INPUT',
        userMessage: 'Prompt title and content are required.',
        developerMessage: 'Title or prompt body was empty.',
        context: 'Prompt create validation failed',
      });
    }

    const client = await getMongoClient();
    const db = client.db();

    const isAdmin = session.role !== 'user';

    const newPrompt = {
      title: title.trim(),
      prompt: prompt.trim(),
      category: category || 'General',
      aiModel: aiModel || 'ChatGPT',
      image: image || '/placeholder-prompt.png',
      userId: session.userId,
      authorName: session.name,
      authorEmail: session.email,
      status: isAdmin ? 'approved' : 'pending',
      visible: isAdmin ? true : false,
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
