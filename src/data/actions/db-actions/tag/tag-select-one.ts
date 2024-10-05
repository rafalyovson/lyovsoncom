import { db } from '@/data/db';
import { tags } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { TagOneResponse } from '@/data/actions/db-actions/tag/index';

export async function tagSelectOneById(data: {
  id: string;
}): Promise<TagOneResponse> {
  try {
    const [theTag] = await db.select().from(tags).where(eq(tags.id, data.id));
    return { success: true, tag: theTag, message: 'Tag selected successfully' };
  } catch (error) {
    return {
      success: false,
      tag: null,
      message: 'Failed to select tag',
      error,
    };
  }
}

export async function tagSelectOneBySlug(data: {
  slug: string;
}): Promise<TagOneResponse> {
  try {
    const [theTag] = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, data.slug));
    return { success: true, tag: theTag, message: 'Tag selected successfully' };
  } catch (error) {
    return {
      success: false,
      tag: null,
      message: 'Failed to select tag',
      error,
    };
  }
}
