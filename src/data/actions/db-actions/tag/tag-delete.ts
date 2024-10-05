import { db } from '@/data/db';
import { tags } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { TagResponse } from '@/data/actions/db-actions/tag/index';

export async function tagDelete(data: { id: string }): Promise<TagResponse> {
  try {
    await db.delete(tags).where(eq(tags.id, data.id));
    return { success: true, message: 'Tag deleted successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to delete tag', error };
  }
}
