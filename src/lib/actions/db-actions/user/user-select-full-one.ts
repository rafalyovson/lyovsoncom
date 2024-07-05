import { UserFullOneResponse } from '@/lib/actions/db-actions/user/index';
import { db } from '@/data/db';
import { images, users } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { UserFull } from '@/data/types/user-full';

export async function userSelectFullOneByUsername(data: {
  username: string;
}): Promise<UserFullOneResponse> {
  console.log('username', data.username);
  try {
    const [result] = await db
      .select({
        user: users,
        image: images,
      })
      .from(users)
      .leftJoin(images, eq(users.imageId, images.id))
      .where(eq(users.username, data.username));
    console.log('result', result);

    if (!result.user) {
      return { success: false, user: null, message: 'User not found' };
    }

    const user: UserFull = result.user;
    user.avatar = result.image || undefined;

    return {
      success: true,
      user: user,
      message: 'User selected successfully',
    };
  } catch (error) {
    return { success: false, user: null, message: 'Failed to select user' };
  }
}
