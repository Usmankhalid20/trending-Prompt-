import { getMongoClient } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-error';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const client = await getMongoClient();
    const db = client.db();

    let query: any = {};
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { _id: id };
    }

    const prompt = await db.collection('prompts').findOne(query);

    if (!prompt) {
      return apiErrorResponse({
        status: 404,
        code: 'PROMPT_NOT_FOUND',
        userMessage: 'We could not find that prompt.',
        developerMessage: `No prompt matched id ${id}.`,
        context: 'Prompt fetch not found',
      });
    }

    return NextResponse.json(prompt);
  } catch (error) {
    return apiErrorResponse({
      status: 500,
      code: 'PROMPT_FETCH_FAILED',
      userMessage: 'We could not load that prompt. Please try again.',
      developerMessage: 'Failed to fetch prompt from MongoDB.',
      error,
      context: 'Error fetching prompt',
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return apiErrorResponse({
      status: 401,
      code: 'UNAUTHORIZED',
      userMessage: 'You need to sign in as an admin to edit prompts.',
      developerMessage: 'Missing or invalid admin session.',
      context: 'Prompt update unauthorized',
    });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const client = await getMongoClient();
    const db = client.db();

    // Remove _id from body to avoid update error
    const { _id, ...updateData } = body;

    const result = await db.collection('prompts').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return apiErrorResponse({
        status: 404,
        code: 'PROMPT_NOT_FOUND',
        userMessage: 'We could not find that prompt.',
        developerMessage: `No prompt matched id ${id}.`,
        context: 'Prompt update not found',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse({
      status: 500,
      code: 'PROMPT_UPDATE_FAILED',
      userMessage: 'We could not update that prompt. Please try again.',
      developerMessage: 'Failed to update prompt in MongoDB.',
      error,
      context: 'Error updating prompt',
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return apiErrorResponse({
      status: 401,
      code: 'UNAUTHORIZED',
      userMessage: 'You need to sign in as an admin to delete prompts.',
      developerMessage: 'Missing or invalid admin session.',
      context: 'Prompt delete unauthorized',
    });
  }

  const { id } = await params;

  try {
    const client = await getMongoClient();
    const db = client.db();

    const result = await db.collection('prompts').deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return apiErrorResponse({
        status: 404,
        code: 'PROMPT_NOT_FOUND',
        userMessage: 'We could not find that prompt.',
        developerMessage: `No prompt matched id ${id}.`,
        context: 'Prompt delete not found',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse({
      status: 500,
      code: 'PROMPT_DELETE_FAILED',
      userMessage: 'We could not delete that prompt. Please try again.',
      developerMessage: 'Failed to delete prompt from MongoDB.',
      error,
      context: 'Error deleting prompt',
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return apiErrorResponse({
      status: 401,
      code: 'UNAUTHORIZED',
      userMessage: 'You need to sign in as an admin to update visibility.',
      developerMessage: 'Missing or invalid admin session.',
      context: 'Prompt visibility unauthorized',
    });
  }

  const { id } = await params;

  try {
    const body = await request.json(); // Expected { visible: boolean }
    const client = await getMongoClient();
    const db = client.db();

    const result = await db.collection('prompts').updateOne(
      { _id: new ObjectId(id) },
      { $set: { visible: body.visible, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return apiErrorResponse({
        status: 404,
        code: 'PROMPT_NOT_FOUND',
        userMessage: 'We could not find that prompt.',
        developerMessage: `No prompt matched id ${id}.`,
        context: 'Prompt visibility not found',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse({
      status: 500,
      code: 'PROMPT_VISIBILITY_UPDATE_FAILED',
      userMessage: 'We could not update the prompt visibility. Please try again.',
      developerMessage: 'Failed to patch prompt visibility in MongoDB.',
      error,
      context: 'Error patching prompt',
    });
  }
}
