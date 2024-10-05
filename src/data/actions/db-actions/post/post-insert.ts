import { db } from '@/data/db';
import { NewPost, postInsertSchema, posts } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { PostOneResponse } from '@/data/actions/db-actions/post/index';

export async function postInsert(data: NewPost): Promise<PostOneResponse> {
  const parsedData = postInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: parsedData.success,
      message: 'Failed to validate Post data',
      post: null,
    };
  }

  try {
    await db.insert(posts).values(data);
    const [newPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, data.slug));
    return {
      success: parsedData.success,
      message: 'Post inserted successfully',
      post: newPost,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to insert post',
      post: null,
      error,
    };
  }
}
