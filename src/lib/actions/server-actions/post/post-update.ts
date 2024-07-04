'use server';

import { postInsertSchema } from '@/data/schema';
import {
  postDeleteById,
  postInsert,
  PostOneResponse,
} from '@/lib/actions/db-actions/post';
import { postUpdate as postUpdateAction } from '../../db-actions/post/post-update';
import { postFromFormData } from '@/lib/utils/post-from-formdata';
import { handlePostCats, handlePostTags } from '@/lib/utils';

export async function postUpdate(
  content: any,
  prevState: PostOneResponse,
  formData: FormData,
): Promise<PostOneResponse> {
  const { post: oldPost } = prevState;

  if (!oldPost) {
    return prevState;
  }

  const data = postFromFormData({ formData, content });
  const parsedData = postInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      message: 'Failed to validate Post data',
      success: false,
      post: null,
    };
  }

  let result;
  if (oldPost.slug !== data.slug) {
    await postDeleteById({ id: oldPost.id });
    result = await postInsert(data);
  } else {
    result = await postUpdateAction(data);
  }

  if (!result || !result.post) {
    return result;
  }

  await handlePostCats({
    formData,
    newPostId: result.post.id,
    oldPostId: oldPost.id,
  });
  await handlePostTags({
    formData,
    newPostId: result.post.id,
    oldPostId: oldPost.id,
  });

  return result;
}
