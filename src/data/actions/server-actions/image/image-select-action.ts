'use server';

import { imageSelectAll } from '@/data/actions/db-actions/image';

export const imageSelectAllAction = async (
  group: string | undefined,
  page: number = 1,
  limit: number = 20,
) => {
  return await imageSelectAll(group, page, limit);
};
