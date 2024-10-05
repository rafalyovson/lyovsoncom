import { PostTable } from '@/components/dungeon/post-table';
import { capitalize } from '@/lib/utils';
import { postSelectFullAll } from '@/data/actions/db-actions/post';

const Categories = async (
  props: {
    params: Promise<{ slug: string }>;
  }
) => {
  const params = await props.params;
  const { slug } = await params;

  const result = await postSelectFullAll();

  if (!result.success || !result.posts) {
    return <div>{result.message}</div>;
  }

  const posts = result.posts.filter((post) =>
    post.categories?.some((cat) => cat.slug === slug),
  );

  if (posts.length === 0) {
    return <div>No posts found for this category</div>;
  }

  return (
    <main>
      <h1>Category: {capitalize(slug!)}</h1>
      <PostTable posts={posts} />
    </main>
  );
};

export default Categories;
