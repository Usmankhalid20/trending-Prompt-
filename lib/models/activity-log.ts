import { ObjectId } from 'mongodb';

export interface ActivityLog {
  _id?: ObjectId;
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  action: string; // e.g. "PROMPT_APPROVED", "USER_SUSPENDED", "ADMIN_CREATED", "ROLE_UPDATED"
  targetType?: string; // e.g. "Prompt", "User", "Admin", "Role", "Category"
  targetId?: string;
  details?: string;
  timestamp: Date;
}
