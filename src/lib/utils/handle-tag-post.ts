import {
  tagPostDelete,
  tagPostInsert,
} from '@/lib/actions/db-actions/tag-post';
import { capitalize, slugify } from '@/lib/utils/index';
import { tagInsert, tagSelectOneBySlug } from '@/lib/actions/db-actions/tag';

export async function handlePostTags({
  formData,
  newPostId,
  oldPostId,
}: {
  formData: FormData;
  newPostId: string;
  oldPostId?: string;
}): Promise<void> {
  if (oldPostId) {
    await tagPostDelete({ postId: oldPostId });
  }

  const tags = (formData.getAll('tags') as string[]).filter(Boolean);

  for (const tag of tags) {
    const slug = slugify(tag);
    const tagSelectResult = await tagSelectOneBySlug({ slug });

    if (tagSelectResult.success && tagSelectResult.tag) {
      await tagPostInsert({ postId: newPostId, tagId: tagSelectResult.tag.id });
    } else {
      const tagInsertResult = await tagInsert({ slug, name: capitalize(tag) });
      if (tagInsertResult.success && tagInsertResult.tag) {
        await tagPostInsert({
          postId: newPostId,
          tagId: tagInsertResult.tag.id,
        });
      } else {
        console.error(`Failed to create tag: ${tag}`);
      }
    }
  }
}
