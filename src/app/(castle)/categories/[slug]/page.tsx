import { postSelectFullAll } from '@/data/actions/db-actions/post';
import { Grid } from '@/components/grid';
import { GridCardPost } from '@/components/grid/grid-card-post';
import { GridCardHero } from '@/components/grid/grid-card-hero';
import { GridCardNav } from '@/components/grid/grid-card-nav';
import { categorySelectOneBySlug } from '@/data/actions/db-actions/category';

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const categoryOneResponse = await categorySelectOneBySlug({
    slug: slug,
  });
  const categoryId = categoryOneResponse.category?.id;
  const result = await postSelectFullAll({ categoryIds: [categoryId] });
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
