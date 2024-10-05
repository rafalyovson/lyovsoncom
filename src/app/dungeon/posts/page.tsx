import { PostTable } from '@/components/dungeon/post-table';
import { PageHeader } from '@/components/dungeon/page-header';

import { postSelectFullAll } from '@/data/actions/db-actions/post';

const Posts = async () => {
  const result = await postSelectFullAll();

  return (
    <main>
      <PageHeader title="Posts" link="/dungeon/posts/create" />
      {result.success && result.posts && <PostTable posts={result.posts} />}
    </main>
  );
};

export default Posts;
