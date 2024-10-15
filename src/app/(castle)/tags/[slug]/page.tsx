import { postSelectFullAll } from '@/data/actions/db-actions/post';
import { Grid } from '@/components/grid';
import { GridCardPost } from '@/components/grid/grid-card-post';
import { GridCardHero } from '@/components/grid/grid-card-hero';
import { GridCardNav } from '@/components/grid/grid-card-nav';
import { tagSelectOneBySlug } from '@/data/actions/db-actions/tag';

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const slugResponse = await tagSelectOneBySlug({ slug });

  const tagId = slugResponse.tag?.id;
  if (!tagId) {
    return <div>Tag not found</div>;
  }
  const result = await postSelectFullAll({ tagIds: [tagId] });
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
