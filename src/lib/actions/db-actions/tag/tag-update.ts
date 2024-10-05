import { db } from '@/data/db';
import { NewTag, tagInsertSchema, tags } from '@/data/schema';
import { eq } from 'drizzle-orm';
import { TagOneResponse } from '@/lib/actions/db-actions/tag';

export async function tagUpdate(data: NewTag): Promise<TagOneResponse> {
  const parsedData = tagInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: parsedData.success,
      message: 'Failed to validate Tag data',
      tag: null,
    };
  }

  try {
    await db.update(tags).set(data).where(eq(tags.slug, data.slug));
    const [newTag] = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, data.slug));
    return {
      success: parsedData.success,
      message: 'Tag updated successfully',
      tag: newTag,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update tag',
      tag: null,
      error,
    };
  }
}
