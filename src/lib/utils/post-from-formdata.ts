import { NewPost } from '@/data/schema';

export function postFromFormData({
  formData,
  content,
}: {
  formData: FormData;
  content: any;
}): NewPost {
  return {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    featuredImageId: formData.get('featuredImageId') as string,
    published: formData.get('published') === 'on',
    content: JSON.stringify(content),
    type: formData.get('type') as string,
    authorId: formData.get('authorId') as string,
    createdAt: new Date(formData.get('createdAt') as string),
  };
}
