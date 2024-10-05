'use server';

import {
  tagDelete as tagDeleteById,
  TagResponse,
} from '@/data/actions/db-actions/tag';

export const tagDeleteAction = async (data: string): Promise<TagResponse> => {
  return await tagDeleteById({ id: data });
};
