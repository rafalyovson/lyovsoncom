import { db } from '@/data/db';
import { Post, posts } from '@/data/schema';
import { eq } from 'drizzle-orm';

type PostSelectOneResponse = {
  success: boolean;
  post: Post | null;
  message: string;
};

export async function postSelectOneBySlug(data: {
  slug: string;
}): Promise<PostSelectOneResponse> {
  try {
    const [thePost] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, data.slug));
    return { success: true, post: thePost, message: 'Success' };
  } catch (error) {
    console.error('Error selecting post by slug:', error);
    return { success: false, post: null, message: 'Error' };
  }
}

export async function postSelectOneById(data: {
  id: string;
}): Promise<PostSelectOneResponse> {
  try {
    const [thePost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, data.id));
    return { success: true, post: thePost, message: 'Success' };
  } catch (error) {
    console.error('Error selecting post by id:', error);
    return { success: false, post: null, message: 'Error' };
  }
}
