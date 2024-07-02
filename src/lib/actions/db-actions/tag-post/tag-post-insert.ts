import { db } from '@/data/db';
import { TagPost, tagPost } from '@/data/schema';
import { z } from 'zod';

export async function tagPostInsert(data: {
  tagId: string;
  postId: string;
}): Promise<{
  success: boolean;
  message: string;
  tagPost: TagPost | null;
}> {
  const schema = z.object({
    tagId: z.string().uuid({ message: 'Invalid tag ID' }),
    postId: z.string().uuid({ message: 'Invalid post ID' }),
  });

  const parsedData = schema.safeParse(data);

  if (!parsedData.success) {
    console.log('Validation error', parsedData.error.issues);
    return {
      success: parsedData.success,
      message: 'Validation error',
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
    console.error('Failed to insert tag:', error);
    return {
      success: false,
      message: 'Failed to insert tag',
      tagPost: null,
    };
  }
}
