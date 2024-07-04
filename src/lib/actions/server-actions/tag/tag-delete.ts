'use server';

import {
  tagDelete as tagDeleteById,
  TagResponse,
} from '@/lib/actions/db-actions/tag';

export const tagDelete = async (data: string): Promise<TagResponse> => {
  return await tagDeleteById({ id: data });
};
