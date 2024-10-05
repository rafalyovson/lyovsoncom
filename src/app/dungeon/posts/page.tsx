import { PostTable } from '@/app/dungeon/ui/post-table';
import { PageHeader } from '../ui/page-header';

import { postSelectFullAll } from '@/lib/actions/db-actions/post';

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
