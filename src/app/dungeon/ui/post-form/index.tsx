import { PostFormClient } from './form';
import { categorySelectAll } from '@/lib/actions/db-actions/category';
import { userSelectAll } from '@/lib/actions/db-actions/user';

export const PostForm = async ({
  post,
  action,
}: {
  post?: any;
  action: any;
}) => {
  const catResult = await categorySelectAll();
  if (!catResult.success || !catResult.categories) {
    return <div>{catResult.message}</div>;
  }
  const authorResult = await userSelectAll();
  if (!authorResult.success || !authorResult.users) {
    return <div>{authorResult.message}</div>;
  }

  return (
    <PostFormClient
      post={post}
      action={action}
      allCats={catResult.categories}
      authors={authorResult.users}
    />
  );
};
