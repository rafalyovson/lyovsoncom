import { PostFullAllResponse } from '@/data/actions/db-actions/post/index';
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
import { PostFull } from '@/data/types/post-full';
import { and, eq, exists, gte, inArray, lte } from 'drizzle-orm';
import { UserFull } from '@/data/types/user-full';
import { SerializedEditorState } from 'lexical';

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

// Helper function to build filter conditions
function buildFilters(data: {
  author?: string;
  published?: boolean;
  featured?: boolean;
  categoryIds?: string[];
  startDate?: Date;
  endDate?: Date;
}) {
  const { author, published, featured, categoryIds, startDate, endDate } = data;
  const filters = [];

  if (published !== undefined) {
    filters.push(eq(posts.published, published));
  }

  if (featured !== undefined) {
    filters.push(eq(posts.featured, featured));
  }

  if (author) {
    filters.push(eq(posts.authorId, author));
  }

  if (categoryIds && categoryIds.length > 0) {
    filters.push(
      exists(
        db
          .select()
          .from(categoryPost)
          .where(
            and(
              eq(categoryPost.postId, posts.id),
              inArray(categoryPost.categoryId, categoryIds),
            ),
          ),
      ),
    );
  }

  // Date range filtering
  if (startDate) {
    filters.push(gte(posts.createdAt, startDate));
  }

  if (endDate) {
    filters.push(lte(posts.createdAt, endDate));
  }

  return filters.length > 0 ? and(...filters) : undefined;
}

export async function postSelectFullAll(
  data: {
    page?: number;
    limit?: number;
    author?: string;
    published?: boolean;
    featured?: boolean;
    categoryIds?: string[];
    tagIds?: string[];
    startDate?: Date;
    endDate?: Date;
  } = {},
): Promise<PostFullAllResponse> {
  const {
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    tagIds,
    ...filterData
  } = data;

  try {
    const offset = (page - 1) * limit;
    const filters = buildFilters(filterData);

    // Build the main query
    const query = db
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
      .where(() => {
        const conditions = [];

        if (filters) {
          conditions.push(filters);
        }

        if (tagIds && tagIds.length > 0) {
          conditions.push(
            exists(
              db
                .select()
                .from(tagPost)
                .where(
                  and(
                    eq(tagPost.postId, posts.id),
                    inArray(tagPost.tagId, tagIds),
                  ),
                ),
            ),
          );
        }

        return and(...conditions);
      })
      .limit(limit)
      .offset(offset);

    const results = await query;

    if (results.length === 0) {
      return { message: 'No posts found', success: false, posts: null };
    }

    // Map posts efficiently
    const postMap = new Map<string, PostFull>();

    for (const result of results) {
      const postId = result.post.id as string;

      if (!postMap.has(postId)) {
        postMap.set(postId, {
          ...result.post,
          author: (result.author as UserFull) || undefined,
          featuredImage: result.featuredImage || undefined,
          categories: [],
          tags: [],
          content: result.post.content as SerializedEditorState,
        });
      }

      const post = postMap.get(postId)!;

      // Add categories
      if (
        result.category &&
        !post.categories?.some((cat) => cat.id === result.category.id)
      ) {
        post.categories?.push(result.category);
      }

      // Add tags
      if (result.tag && !post.tags?.some((tag) => tag.id === result.tag?.id)) {
        post.tags?.push(result.tag);
      }
    }

    return {
      message: 'Posts selected successfully',
      success: true,
      posts: Array.from(postMap.values()),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return {
      message: `Failed to select posts: ${errorMessage}`,
      success: false,
      posts: null,
      error,
    };
  }
}
