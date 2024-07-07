'use server';

import { userInsertSchema } from '@/data/schema';
import { userUpdateByUsername } from '@/lib/actions/db-actions/user/user-update';
import { UserOneResponse } from '@/lib/actions/db-actions/user';

export const userUpdateAction = async (
  longBio: any,
  prevState: any,
  formData: FormData,
): Promise<UserOneResponse> => {
  console.log('🐤', JSON.stringify(longBio));
  const username = prevState.user?.username;
  if (!username) {
    return {
      success: false,
      message: 'User not found',
      user: null,
    };
  }

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    username: formData.get('username') as string,
    shortBio: formData.get('shortBio') as string,
    longBio: JSON.stringify(longBio),
    image: formData.get('image') as string,
    imageId: formData.get('imageId') as string,
    xLink: formData.get('xLink') as string,
    redditLink: formData.get('redditLink') as string,
    linkedInLink: formData.get('linkedInLink') as string,
    githubLink: formData.get('githubLink') as string,
    youtubeLink: formData.get('youtubeLink') as string,
  };

  const parsedData = userInsertSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      success: parsedData.success,
      message: 'Failed to validate User data',
      user: null,
    };
  }
  return await userUpdateByUsername(data);
};
