'use server';

import { User, userInsertSchema } from '@/data/schema';
import { userUpdateByUsername } from '@/lib/actions/db-actions/user/user-update';
import { UserOneResponse } from '@/lib/actions/db-actions/user';

export const userUpdate = async (
  user: User,
  _prevState: any,
  formData: FormData,
): Promise<UserOneResponse> => {
  const { username } = user;
  if (!username) {
    return {
      success: false,
      message: 'User not found',
      user: null,
    };
  }

  const data = Object.fromEntries(formData);
  const parsedData = userInsertSchema.safeParse(data);
  if (!parsedData.success) {
    console.log('Validation error', parsedData.error.issues);
    return {
      success: parsedData.success,
      message: 'Validation error',
      user: null,
    };
  }
  return await userUpdateByUsername({
    ...data,
    email: data.email as string,
  });
};
