import { postSelectFullAll } from '@/data/actions/db-actions/post';
import { Grid } from '@/components/grid';
import { GridCardPost } from '@/components/grid/grid-card-post';
import { GridCardHero } from '@/components/grid/grid-card-hero';
import { GridCardNav } from '@/components/grid/grid-card-nav';
import { userSelectByUsername } from '@/data/actions/db-actions/user';

const page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const pageParams = await params;
  const { username } = pageParams;
  const userResult = await userSelectByUsername({ username });
  const userId = userResult.user?.id;
  const result = await postSelectFullAll({
    author: userId,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-09-31'),
  });
  if (!result.success || !result.posts) {
    return <div>{result.message}</div>;
  }
  const { posts } = result;

  return (
    <Grid>
      <GridCardHero />
      <GridCardNav />
      {posts.map((post) => (
        <GridCardPost key={post.id} post={post} />
      ))}
    </Grid>
  );
};

export default page;
