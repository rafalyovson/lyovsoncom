import { db } from '@/data/db';
import { tags } from '@/data/schema';
import { eq } from 'drizzle-orm';

export async function tagDelete(data: { id: string }): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await db.delete(tags).where(eq(tags.id, data.id));
    return { success: true, message: 'Tag deleted successfully' };
  } catch (error) {
    console.error('Failed to delete tag:', error);
    return { success: false, message: 'Failed to delete tag' };
  }
}
