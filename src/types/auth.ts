import type { Session, User } from '@supabase/supabase-js';

export type { Session, User };

export interface Profile {
  id: string;
  fullname: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}
