import { PostFull } from '@/data/types/post-full';
import { PostGrid } from '@/components/castle/post-grid';
import { userSelectByUsername } from '@/data/actions/db-actions/user/user-select-one';
import { redirect } from 'next/navigation';
import { postSelectFullAll } from '@/data/actions/db-actions/post';

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const userResult = await userSelectByUsername({ username });

  if (!userResult.success || !userResult.user) {
    redirect(`/`);
  }

  const result = await postSelectFullAll();

  if (!result.success || !result.posts) {
    return <h1>{result.message}</h1>;
  }

  const userPosts = result.posts.filter(
    (post: PostFull) => post.author!.username === userResult.user!.username,
  );

  return (
    <main>
      <h1 className={`text-2xl text-center`}>{userResult.user.name}</h1>
      <PostGrid posts={userPosts} />
    </main>
  );
};
export default Page;
