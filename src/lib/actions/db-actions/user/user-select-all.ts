import { db } from '@/data/db';
import { User, users } from '@/data/schema';

type UserSelectAllResponse = {
  success: boolean;
  users: User[] | null;
  message: string;
};

export async function userSelectAll(): Promise<UserSelectAllResponse> {
  try {
    const allUsers = await db.select().from(users);
    return { success: true, users: allUsers, message: 'Success' };
  } catch (error) {
    console.error('Error selecting all users:', error);
    return { success: false, users: null, message: 'Error' };
  }
}