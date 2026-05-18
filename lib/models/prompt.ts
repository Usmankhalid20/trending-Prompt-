import { ObjectId } from 'mongodb';

export interface Prompt {
  _id?: ObjectId;
  id?: number; // Legacy ID for frontend compatibility
  title: string;
  image: string;
  prompt: string;
  date: string;
  visible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
