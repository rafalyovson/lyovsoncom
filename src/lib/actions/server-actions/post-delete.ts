'use server';

import {
  imageDeleteByUrl,
  imageSelectById,
} from '@/lib/actions/db-actions/image';
import {
  postDeleteById,
  postSelectOneById,
} from '@/lib/actions/db-actions/post';

export const postDelete = async (
  _prevState: { message: string; success: boolean },
  formData: FormData,
): Promise<{ success: boolean; message: string }> => {
  const postId = formData.get('id') as string;
  const { success, post } = await postSelectOneById({ id: postId });
  if (!success || !post) {
    return { success: false, message: 'Post not found' };
  }

  const {
    image,
    success: imageSuccess,
    message: imageMessage,
  } = await imageSelectById({ id: post.featuredImageId! });

  if (!imageSuccess || !image) {
    return { success: imageSuccess, message: imageMessage };
  }

  const imageResult = await imageDeleteByUrl({ url: image.url });

  if (!imageResult.success) {
    return imageResult;
  }

  return await postDeleteById({ id: postId });
};
