import { db } from '@/data/db';
import { NewPost, Post, postInsertSchema, posts } from '@/data/schema';
import { eq } from 'drizzle-orm';

type PostInsertResponse = {
  success: boolean;
  message: string;
  post: Post | null;
};

export async function postInsert(data: NewPost): Promise<PostInsertResponse> {
  const parsedData = postInsertSchema.safeParse(data);

  if (!parsedData.success) {
    console.log('Validation error', parsedData.error.issues);
    return {
      success: parsedData.success,
      message: 'Validation error',
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
      message: 'Post created successfully',
      post: newPost,
    };
  } catch (error) {
    console.error('Failed to insert post:', error);
    return {
      success: false,
      message: 'Failed to insert post',
      post: null,
    };
  }
}
