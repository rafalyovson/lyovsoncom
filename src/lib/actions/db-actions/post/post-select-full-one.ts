import { db } from '@/data/db';
import {
  categories,
  categoryPost,
  images,
  posts,
  tagPost,
  tags,
  users,
} from '@/data/schema';
import { eq } from 'drizzle-orm';
import { PostFullOneResponse } from '@/lib/actions/db-actions/post';
import { PostFull } from '@/data/types/post-full';
import { UserFull } from '@/data/types/user-full';
import { SerializedEditorState } from 'lexical';

export async function postSelectFullOneBySlug(data: {
  slug: string;
}): Promise<PostFullOneResponse> {
  try {
    const results = await db
      .select({
        post: posts,
        author: users,
        featuredImage: images,
        category: categories,
        tag: tags,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(images, eq(posts.featuredImageId, images.id))
      .leftJoin(categoryPost, eq(posts.id, categoryPost.postId))
      .leftJoin(categories, eq(categoryPost.categoryId, categories.id))
      .leftJoin(tagPost, eq(posts.id, tagPost.postId))
      .leftJoin(tags, eq(tagPost.tagId, tags.id))
      .where(eq(posts.slug, data.slug));

    if (results.length === 0) {
      return { message: 'No post found', success: false, post: null };
    }

    const post: PostFull = {
      ...results[0].post,
      author: (results[0].author as UserFull) || undefined,
      featuredImage: results[0].featuredImage || undefined,
      categories: [],
      tags: [],
      content: results[0].post.content as SerializedEditorState,
    };

    results.forEach((result) => {
      if (
        result.category &&
        !post.categories?.some((cat) => cat.id === result.category.id)
      ) {
        post.categories?.push(result.category);
      }
      if (result.tag && !post.tags?.some((tag) => tag.id === result.tag!.id)) {
        post.tags?.push(result.tag);
      }
    });

    return { message: 'Post selected successfully', success: true, post: post };
  } catch (error) {
    return {
      message: 'Failed to select post',
      success: false,
      post: null,
      error,
    };
  }
}
