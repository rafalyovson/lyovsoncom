import { db } from '@/data/db';
import { NewTag, tagInsertSchema, tags } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { TagOneResponse } from '@/data/actions/db-actions/tag/index';

export async function tagInsert(data: NewTag): Promise<TagOneResponse> {
  const parsedData = tagInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: parsedData.success,
      message: 'Failed to validate Tag data',
      tag: null,
    };
  }

  try {
    await db.insert(tags).values(data);
    const [newTag] = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, data.slug));
    return {
      success: parsedData.success,
      message: 'Tag inserted successfully',
      tag: newTag,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to insert tag',
      tag: null,
      error,
    };
  }
}
