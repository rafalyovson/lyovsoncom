import { PostFormClient } from './form';
import { categorySelectAll } from '@/lib/actions/db-actions/category';
import { userSelectAll } from '@/lib/actions/db-actions/user';
import { PostFull } from '@/data/types';
import { imageSelectAll } from '@/lib/actions/db-actions/image';

type PostFormProps = {
  post?: PostFull;
  action: any;
};

export async function PostForm({ post, action }: PostFormProps) {
  const catResult = await categorySelectAll();
  if (!catResult.success || !catResult.categories) {
    return <div>{catResult.message}</div>;
  }
  const authorResult = await userSelectAll();
  if (!authorResult.success || !authorResult.users) {
    return <div>{authorResult.message}</div>;
  }
  const imagesResult = await imageSelectAll();
  if (!imagesResult.success || !imagesResult.images) {
    return <div>{imagesResult.message}</div>;
  }

  return (
    <>
      <PostFormClient
        post={post}
        action={action}
        allCats={catResult.categories}
        authors={authorResult.users}
        allImages={imagesResult.images}
      />
    </>
  );
}
