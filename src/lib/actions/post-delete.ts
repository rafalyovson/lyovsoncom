"use server";

import { imageDeletebyUrl } from "./db-actions/image-delete";
import { imageSelectById } from "./db-actions/image-select";
import { postDeleteById } from "./db-actions/post-delete";
import { postSelectById } from "./db-actions/post-select";

export const postDelete = async (
  _prevState: { message: string; success: boolean },
  formData: FormData
): Promise<{ success: boolean; message: string }> => {
  const postId = formData.get("id") as string;
  const { success, post } = await postSelectById({ id: postId });
  if (!success || !post) {
    return { success: false, message: "Post not found" };
  }

  const {
    image,
    success: imageSuccess,
    message: imageMessage,
  } = await imageSelectById({ id: post.featuredImageId! });

  if (!imageSuccess || !image) {
    return { success: imageSuccess, message: imageMessage };
  }

  const imageResult = await imageDeletebyUrl({ url: image.url });

  if (!imageResult.success) {
    return imageResult;
  }

  const result = await postDeleteById({ id: postId });

  return result;
};
