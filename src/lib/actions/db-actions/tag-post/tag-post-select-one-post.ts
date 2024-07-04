import { db } from '@/data/db';
import { TagPost, tagPost } from '@/data/schema';
import { eq } from 'drizzle-orm';

type TagPostSelectOnePostResponse = {
  success: boolean;
  tagPosts: TagPost[] | null;
  message: string;
};

export async function tagPostSelectOnePost(data: {
  postId: string;
}): Promise<TagPostSelectOnePostResponse> {
  try {
    const allTagPosts = await db
      .select()
      .from(tagPost)
      .where(eq(tagPost.postId, data.postId));
    return { success: true, tagPosts: allTagPosts, message: 'Success' };
  } catch (error) {
    console.error('Error selecting tags:', error);
    return { success: false, tagPosts: null, message: 'Error' };
  }
}
