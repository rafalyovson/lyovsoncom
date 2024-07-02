import { PostGrid } from '@/app/(castle)/ui/post-grid';
import { postSelectFullAll } from '@/lib/actions/db-actions/post/post-select-full';

const page = async () => {
  const result = await postSelectFullAll();
  if (!result.success || !result.posts) {
    return <div>{result.message}</div>;
  }

  const posts = result.posts.filter((post) => post.published);
  return <PostGrid posts={posts} />;
};

export default page;
