import { UserFullAllResponse } from '@/data/actions/db-actions/user/index';
import { images, users } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/data/db';
import { UserFull } from '@/data/types/user-full';
import { SerializedEditorState } from 'lexical';

export async function userSelectFullAll(): Promise<UserFullAllResponse> {
  try {
    const results = await db
      .select({
        user: users,
        avatar: images,
      })
      .from(users)
      .leftJoin(images, eq(users.imageId, images.id));

    if (results.length === 0) {
      return { success: false, users: null, message: 'No users found' };
    }

    const allUsers: UserFull[] = results.map((result) => ({
      ...result.user,
      avatar: result.avatar || undefined,
      longBio: result.user.longBio as SerializedEditorState,
    }));

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
