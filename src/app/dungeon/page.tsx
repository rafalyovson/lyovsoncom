import { PageHeader } from '@/components/dungeon/page-header';
import { PostTable } from '@/components/dungeon/post-table';
import { postSelectFullAll } from '@/data/actions/db-actions/post';

const DungeonHome = async () => {
  const result = await postSelectFullAll();
  return (
    <main>
      <PageHeader title="Dungeon" link="/dungeon" />
      {result.success && result.posts && <PostTable posts={result.posts} />}
    </main>
  );
};

export default DungeonHome;
