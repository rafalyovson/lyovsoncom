import { db } from '@/data/db';
import { users } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { UserOneResponse } from '@/lib/actions/db-actions/user';

export async function userSelectByUsername(data: {
  username: string;
}): Promise<UserOneResponse> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, data.username));

  if (!user) {
    return { success: false, message: 'Failed to select user', user: null };
  }

  return { success: true, message: 'User selected successfully', user: user };
}
