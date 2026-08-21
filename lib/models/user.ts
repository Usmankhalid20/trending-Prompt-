import { ObjectId } from 'mongodb';

export type UserRole =
  | 'user'
  | 'creator'
  | 'admin'
  | 'super_admin'
  | 'senior_admin'
  | 'content_admin'
  | 'moderator';

export type UserStatus = 'active' | 'pending' | 'approved' | 'rejected' | 'suspended';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string; // Hashed password
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}
