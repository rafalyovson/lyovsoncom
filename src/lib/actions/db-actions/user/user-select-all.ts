import { db } from '@/data/db';
import { users } from '@/data/schema';
import { UserAllResponse } from '@/lib/actions/db-actions/user';

export async function userSelectAll(): Promise<UserAllResponse> {
  try {
    const allUsers = await db.select().from(users);
    return {
      success: true,
      users: allUsers,
      message: 'Users selected successfully',
    };
  } catch (error) {
    return {
      success: false,
      users: null,
      message: 'Failed to select users',
      error,
    };
  }
}
