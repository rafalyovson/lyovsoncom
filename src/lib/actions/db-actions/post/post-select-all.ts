import { Post, posts } from '@/data/schema';
import { db } from '@/data/db';

type PostSelectAllResponse = {
  success: boolean;
  posts: Post[] | null;
  message: string;
};

export async function postSelectAll(): Promise<PostSelectAllResponse> {
  try {
    const allPosts = await db.select().from(posts);
    return { success: true, posts: allPosts, message: 'Success' };
  } catch (error) {
    console.error('Error selecting all posts:', error);
    return { success: false, posts: null, message: 'Error' };
  }
}