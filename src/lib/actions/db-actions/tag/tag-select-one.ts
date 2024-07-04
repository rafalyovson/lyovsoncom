import { db } from '@/data/db';
import { Tag, tags } from '@/data/schema';
import { eq } from 'drizzle-orm';

type TagSelectOneResponse = {
  success: boolean;
  tag: Tag | null;
  message: string;
};

export async function tagSelectOneById(data: {
  id: string;
}): Promise<TagSelectOneResponse> {
  try {
    const [theTag] = await db.select().from(tags).where(eq(tags.id, data.id));
    return { success: true, tag: theTag, message: 'Success' };
  } catch (error) {
    console.error('Error selecting tag by id:', error);
    return { success: false, tag: null, message: 'Error' };
  }
}

export async function tagSelectOneBySlug(data: {
  slug: string;
}): Promise<TagSelectOneResponse> {
  try {
    const [theTag] = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, data.slug));
    return { success: true, tag: theTag, message: 'Success' };
  } catch (error) {
    console.error('Error selecting tag by slug:', error);
    return { success: false, tag: null, message: 'Error' };
  }
}
