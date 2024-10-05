import { PostGrid } from '@/components/castle/post-grid';

import { postSelectFullAll } from '@/data/actions/db-actions/post';

const page = async () => {
  const result = await postSelectFullAll();
  if (!result.success || !result.posts) {
    return <div>{result.message}</div>;
  }

  const posts = result.posts.filter((post) => post.published);
  return <PostGrid posts={posts} />;
};

export default page;
