import { PostTable } from '@/app/dungeon/ui/post-table';
import { capitalize } from '@/lib/utils';
import { postSelectFullAll } from '@/lib/actions/db-actions/post';

const Categories = async ({ params }: { params: any }) => {
  const { slug } = params;

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
