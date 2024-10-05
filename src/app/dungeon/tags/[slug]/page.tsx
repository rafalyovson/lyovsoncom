import { PostTable } from '@/components/dungeon/post-table';
import { capitalize } from '@/lib/utils';

import { postSelectFullAll } from '@/data/actions/db-actions/post';

const Tags = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const { slug } = await params;

  const result = await postSelectFullAll();

  if (!result.success || !result.posts) {
    return <div>No posts available</div>;
  }

  const posts = result.posts.filter((post) =>
    post.tags?.some((tag) => tag.slug === slug),
  );

  if (posts.length === 0) {
    return <div>No posts found for this tag</div>;
  }

  return (
    <main>
      <h1>Tag: {capitalize(slug!)}</h1>
      <PostTable posts={posts} />
    </main>
  );
};

export default Tags;
