import { PostTable } from '@/app/dungeon/ui/post-table';
import { PageHeader } from '../ui/page-header';
import { postSelectFullAll } from '@/lib/actions/db-actions/post/post-select-full';

const Posts = async () => {
  const result = await postSelectFullAll();

  if (!result.success || !result.posts) {
    return <div>{result.message}</div>;
  }

  return (
    <main>
      <PageHeader title="Posts" link="/dungeon/posts/create" />
      <PostTable posts={result.posts} />
    </main>
  );
};

export default Posts;
