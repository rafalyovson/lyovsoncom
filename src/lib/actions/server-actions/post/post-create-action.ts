'use server';

import { postInsertSchema } from '@/data/schema';
import { postInsert, PostOneResponse } from '@/lib/actions/db-actions/post';
import { postFromFormData } from '@/lib/utils/post-from-formdata';
import { handlePostCats, handlePostTags } from '@/lib/utils';

export async function postCreateAction(
  content: any,
  _prevState: PostOneResponse,
  formData: FormData,
): Promise<PostOneResponse> {
  const data = postFromFormData({ formData, content });
  const parsedData = postInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      message: 'Failed to validate Post data',
      success: false,
      post: null,
    };
  }

  const postResult = await postInsert(data);

  if (!postResult.success || !postResult.post) {
    return postResult;
  }

  await handlePostCats({
    formData,
    newPostId: postResult.post.id,
  });
  await handlePostTags({
    formData,
    newPostId: postResult.post.id,
  });

  return postResult;
}
