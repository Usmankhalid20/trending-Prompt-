import { ObjectId } from 'mongodb';

export interface Category {
  _id?: ObjectId;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
