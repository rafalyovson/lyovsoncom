import { Tag, tags } from '@/data/schema';
import { db } from '@/data/db';

type TagSelectAllResponse = {
  success: boolean;
  tags: Tag[] | null;
  message: string;
};

export async function tagSelectAll(): Promise<TagSelectAllResponse> {
  try {
    const allTags = await db.select().from(tags);
    return { success: true, tags: allTags, message: 'Success' };
  } catch (error) {
    console.error('Error selecting all tags:', error);
    return { success: false, tags: null, message: 'Error' };
  }
}