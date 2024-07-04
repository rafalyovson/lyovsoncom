import { db } from '@/data/db';
import { tagPost, tagPostInsertSchema } from '@/data/schema';
import { TagPostOneResponse } from '@/lib/actions/db-actions/tag-post';

export async function tagPostInsert(data: {
  tagId: string;
  postId: string;
}): Promise<TagPostOneResponse> {
  const parsedData = tagPostInsertSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: parsedData.success,
      message: 'Error validating TagPost data',
      tagPost: null,
    };
  }
  try {
    await db.insert(tagPost).values(data);
    return {
      success: parsedData.success,
      message: 'TagPost created successfully',
      tagPost: data,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to insert TagPost',
      tagPost: null,
    };
  }
}
