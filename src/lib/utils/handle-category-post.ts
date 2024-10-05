import { categorySelectOneBySlug } from '@/lib/actions/db-actions/category';
import { slugify } from '@/lib/utils/index';
import {
  categoryPostDelete,
  categoryPostInsert,
} from '@/lib/actions/db-actions/category-post';

export async function handlePostCats({
  formData,
  newPostId,
  oldPostId,
}: {
  formData: FormData;
  newPostId: string;
  oldPostId?: string;
}): Promise<void> {
  const categoryName = formData.get('category') as string;
  if (!categoryName) return;

  const { success, category } = await categorySelectOneBySlug({
    slug: slugify(categoryName),
  });
  if (success && category) {
    if (oldPostId) {
      await categoryPostDelete({ postId: oldPostId });
    }
    await categoryPostInsert({ postId: newPostId, categoryId: category.id });
  }
}
