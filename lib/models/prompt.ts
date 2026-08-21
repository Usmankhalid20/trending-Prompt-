import { ObjectId } from 'mongodb';

export type PromptStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published';

export interface Prompt {
  _id?: ObjectId;
  id?: number; // Legacy numerical ID
  userId?: ObjectId | string;
  authorName?: string;
  authorEmail?: string;
  title: string;
  prompt: string;
  description?: string;
  category?: string;
  aiModel?: string;
  tags?: string[];
  image?: string;
  status: PromptStatus;
  rejectionReason?: string;
  date?: string;
  visible?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

