import { PostFull } from '@/data/types/post-full';
import { PostGrid } from '../../ui/post-grid';
import { userSelectByUsername } from '@/lib/actions/db-actions/user/user-select-one';
import { redirect } from 'next/navigation';
import { postSelectFullAll } from '@/lib/actions/db-actions/post';

const Page = async () => {
  const userResult = await userSelectByUsername({ username: 'jess' });

  if (!userResult.success || !userResult.user) {
    redirect('/rafa');
  }

  const result = await postSelectFullAll();

  if (!result.success || !result.posts) {
    return <h1>{result.message}</h1>;
  }

  const rafaPosts = result.posts.filter(
    (post: PostFull) => post.author!.username === userResult.user!.username,
  );

  return (
    <>
      <h1>Rafa</h1>
      <PostGrid posts={rafaPosts} />
    </>
  );
};
export default Page;
