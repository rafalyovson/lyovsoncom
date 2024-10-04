import { NewPost } from '@/data/schema';
import { slugify } from '@/lib/utils/index';
import { SerializedEditorState } from 'lexical';

export function postFromFormData({
  formData,
  content,
}: {
  formData: FormData;
  content: SerializedEditorState | null;
}): NewPost {
  return {
    title: formData.get('title') as string,
    slug: slugify(formData.get('title') as string),
    featuredImageId: formData.get('imageId') as string,
    published: formData.get('published') === 'on',
    featured: formData.get('featured') === 'on',
    content: JSON.stringify(content),
    type: formData.get('type') as string,
    authorId: formData.get('authorId') as string,
    createdAt: new Date(formData.get('createdAt') as string),
  };
}
