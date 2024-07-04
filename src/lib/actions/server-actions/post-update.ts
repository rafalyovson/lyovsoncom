'use server';

import { NewPost, Post, postInsertSchema } from '@/data/schema';
import { capitalize, slugify } from '@/lib/utils';
import {
  categoryPostDelete,
  categoryPostInsert,
} from '@/lib/actions/db-actions/category-post';
import { categorySelectOneBySlug } from '@/lib/actions/db-actions/category';
import { postDeleteById, postInsert } from '@/lib/actions/db-actions/post';
import { postUpdate as postUpdateAction } from '../db-actions/post/post-update';
import { tagInsert } from '../db-actions/tag/tag-insert';
import {
  tagPostDelete,
  tagPostInsert,
} from '@/lib/actions/db-actions/tag-post';
import { tagSelectOneBySlug } from '@/lib/actions/db-actions/tag';

export async function postUpdate(
  content: any, // Changed JSON to any for better TypeScript compatibility
  prevState: { message: string; success: boolean; post: Post },
  formData: FormData,
): Promise<{ success: boolean; message: string; post: Post | null }> {
  const { post: oldPost } = prevState;

  console.log('🐤', formData);

  const data: NewPost = {
    title: formData.get('title') as string,
    slug: slugify(formData.get('title') as string),
    featuredImageId: formData.get('featuredImageId') as string,
    published: formData.get('published') === 'on',
    content: JSON.stringify(content),
    type: formData.get('type') as string,
    authorId: formData.get('authorId') as string,
    createdAt: new Date(formData.get('createdAt') as string),
  };

  const parsedData = postInsertSchema.safeParse(data);

  if (!parsedData.success) {
    console.log('Validation error', parsedData.error.issues);
    return { message: 'Validation error', success: false, post: null };
  }

  try {
    let newPost;
    if (oldPost.slug !== data.slug) {
      await postDeleteById({ id: oldPost.id });
      const { post } = await postInsert(data);
      newPost = post;
    } else {
      const { post } = await postUpdateAction(data);
      newPost = post;
    }

    if (!newPost) {
      return { message: 'Post not found', success: false, post: null };
    }

    const categoryName = formData.get('category') as string;
    if (categoryName) {
      const result = await categorySelectOneBySlug({
        slug: slugify(categoryName),
      });

      if (result.success && result.category) {
        await categoryPostDelete({
          postId: oldPost.id,
        });
        await categoryPostInsert({
          postId: newPost.id,
          categoryId: result.category.id,
        });
      }
    }

    await tagPostDelete({
      postId: oldPost.id,
    });

    const newPostTagStrings = formData.getAll('tags') as string[];
    for (const tag of newPostTagStrings.filter(Boolean)) {
      const tagSlug = slugify(tag);
      const tagName = capitalize(tag);
      const result = await tagSelectOneBySlug({ slug: tagSlug });

      if (result.success && result.tag) {
        await tagPostInsert({
          postId: newPost.id,
          tagId: result.tag.id,
        });
      } else {
        const result = await tagInsert({
          name: tagName,
          slug: tagSlug,
        });

        if (result.success && result.tag) {
          await tagPostInsert({
            postId: newPost.id,
            tagId: result.tag.id,
          });
        }
      }
    }
    return {
      message: 'Post updated successfully',
      success: true,
      post: newPost,
    };
  } catch (error) {
    console.error('Failed to insert post:', error);
    return {
      message: 'Failed to insert post',
      success: false,
      post: null,
    };
  }
}
