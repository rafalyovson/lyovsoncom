import { postSelectFullAll } from '@/data/actions/db-actions/post';
import { Grid } from '@/components/grid';
import { GridCardPost } from '@/components/grid/grid-card-post';
import { GridCardHero } from '@/components/grid/grid-card-hero';
import { GridCardNav } from '@/components/grid/grid-card-nav';

const page = async () => {
  const result = await postSelectFullAll();
  if (!result.success || !result.posts) {
    return <div>{result.message}</div>;
  }

  const posts = result.posts.filter((post) => post.published);
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
