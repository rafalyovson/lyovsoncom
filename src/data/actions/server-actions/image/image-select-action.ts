'use server';

import { imageSelectAll } from '@/data/actions/db-actions/image';

export const imageSelectAllAction = async (
  data: {
    group: string | undefined;
    page: number;
    limit: number;
  } = {
    group: undefined,
    page: 1,
    limit: 20,
  },
) => {
  return await imageSelectAll(data);
};
