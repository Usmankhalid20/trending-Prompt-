import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getSession, hasPermission } from '@/lib/auth';
import { ObjectId } from 'mongodb';

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
    const { action, rejectionReason, title, prompt, category, aiModel } = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const promptsCollection = db.collection('prompts');
    const logsCollection = db.collection('activity_logs');

    let query: any;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { id: parseInt(id, 10) };
    }

    const targetPrompt = await promptsCollection.findOne(query);
    if (!targetPrompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    const updates: any = { updatedAt: new Date() };

    if (action === 'approve') {
      if (!(await hasPermission(session, 'prompts:approve'))) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      updates.status = 'approved';
      updates.visible = true;
    } else if (action === 'reject') {
      if (!(await hasPermission(session, 'prompts:reject'))) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      updates.status = 'rejected';
      updates.visible = false;
      updates.rejectionReason = rejectionReason || 'Content did not meet guidelines.';
    } else if (action === 'publish') {
      if (!(await hasPermission(session, 'prompts:publish'))) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      updates.status = 'published';
      updates.visible = true;
    } else if (action === 'hide') {
      if (!(await hasPermission(session, 'prompts:hide'))) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      updates.visible = false;
    } else if (action === 'edit') {
      if (!(await hasPermission(session, 'prompts:edit'))) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (title) updates.title = title.trim();
      if (prompt) updates.prompt = prompt.trim();
      if (category) updates.category = category;
      if (aiModel) updates.aiModel = aiModel;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await promptsCollection.updateOne(query, { $set: updates });

    // Log Activity
    await logsCollection.insertOne({
      actorId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: `PROMPT_${action.toUpperCase()}`,
      targetType: 'Prompt',
      targetId: id,
      details: `Admin ${session.email} executed ${action} on prompt "${targetPrompt.title}"`,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: `Prompt successfully ${action}d` });
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
    if (!session || !(await hasPermission(session, 'prompts:delete'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();
    const promptsCollection = db.collection('prompts');
    const logsCollection = db.collection('activity_logs');

    let query: any;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { id: parseInt(id, 10) };
    }

    await promptsCollection.deleteOne(query);

    // Log Activity
    await logsCollection.insertOne({
      actorId: session.userId,
      actorEmail: session.email,
      actorRole: session.role,
      action: 'PROMPT_DELETED',
      targetType: 'Prompt',
      targetId: id,
      details: `Admin ${session.email} deleted prompt ID ${id}`,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: 'Prompt deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
