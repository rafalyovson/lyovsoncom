import { db } from '@/data/db';
import { User, users } from '@/data/schema';
import { eq } from 'drizzle-orm';

export async function userSelectAll(): Promise<{
  success: boolean;
  users: User[] | null;
  message: string;
}> {
  try {
    const allUsers = await db.select().from(users);
    return { success: true, users: allUsers, message: 'Success' };
  } catch (error) {
    console.error('Error selecting all users:', error);
    return { success: false, users: null, message: 'Error' };
  }
}

export async function userSelectByUsername(data: {
  username: string;
}): Promise<{
  message: string;
  success: boolean;
  user: User | null;
}> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, data.username));

  if (!user) {
    return { success: false, message: 'User not found', user: null };
  }

  return { success: true, message: 'Success', user: user };
}
