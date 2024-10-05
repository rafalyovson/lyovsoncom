import { NewUser, userInsertSchema, users } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/data/db';
import { UserOneResponse } from '@/lib/actions/db-actions/user/index';

export async function userUpdateByUsername(
  data: NewUser,
): Promise<UserOneResponse> {
  const parsedData = userInsertSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      success: parsedData.success,
      message: 'Failed to validate User data',
      user: null,
    };
  }
  try {
    await db.update(users).set(data).where(eq(users.username, data.username!));
    const [newUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, data.username!));
    return {
      success: parsedData.success,
      message: 'User updated successfully',
      user: newUser,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update user',
      user: null,
      error,
    };
  }
}