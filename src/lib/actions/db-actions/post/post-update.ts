import { db } from '@/data/db';
import { NewPost, postInsertSchema, posts } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { PostOneResponse } from '@/lib/actions/db-actions/post';

export async function postUpdate(data: NewPost): Promise<PostOneResponse> {
  const parsedData = postInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: parsedData.success,
      message: 'Failed to validate Post data',
      post: null,
    };
  }

  try {
    await db.update(posts).set(data).where(eq(posts.slug, data.slug));
    const [newPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, data.slug));
    return {
      success: parsedData.success,
      message: 'Post updated successfully',
      post: newPost,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update post',
      post: null,
      error,
    };
  }
}
