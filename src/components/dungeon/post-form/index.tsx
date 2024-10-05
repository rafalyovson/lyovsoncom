import { PostFormClient } from './form';
import { categorySelectAll } from '@/data/actions/db-actions/category';
import { userSelectAll } from '@/data/actions/db-actions/user';
import { PostFull } from '@/data/types';
import { postOneAction } from '@/data/types/post-types';

type PostFormProps = {
  post?: PostFull;
  action: postOneAction;
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

  return (
    <>
      <PostFormClient
        post={post}
        action={action}
        allCats={catResult.categories}
        authors={authorResult.users}
      />
    </>
  );
}
