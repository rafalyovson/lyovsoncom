'use server';

import {
  imageDeleteByUrl,
  imageSelectOneById,
} from '@/data/actions/db-actions/image';
import {
  postDeleteById,
  PostResponse,
  postSelectOneById,
} from '@/data/actions/db-actions/post';

export const postDeleteAction = async (
  _prevState: PostResponse,
  formData: FormData,
): Promise<PostResponse> => {
  const postId = formData.get('id') as string;
  const { success, post } = await postSelectOneById({ id: postId });
  if (!success || !post) {
    return { success: false, message: 'Post not found' };
  }

  const {
    image,
    success: imageSuccess,
    message: imageMessage,
  } = await imageSelectOneById({ id: post.featuredImageId! });

  if (!imageSuccess || !image) {
    return { success: imageSuccess, message: imageMessage };
  }

  const imageResult = await imageDeleteByUrl({ url: image.url });

  if (!imageResult.success) {
    return imageResult;
  }

  return await postDeleteById({ id: postId });
};
