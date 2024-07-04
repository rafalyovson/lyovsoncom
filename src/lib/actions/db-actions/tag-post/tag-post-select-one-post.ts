import { db } from '@/data/db';
import { tagPost } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { TagPostAllResponse } from '@/lib/actions/db-actions/tag-post';

export async function tagPostSelectOnePost(data: {
  postId: string;
}): Promise<TagPostAllResponse> {
  try {
    const allTagPosts = await db
      .select()
      .from(tagPost)
      .where(eq(tagPost.postId, data.postId));
    return {
      success: true,
      tagPosts: allTagPosts,
      message: 'TagPosts selected successfully',
    };
  } catch (error) {
    return {
      success: false,
      tagPosts: null,
      message: 'Failed to select tagPosts',
    };
  }
}
