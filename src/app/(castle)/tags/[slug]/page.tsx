import { postSelectFullAll } from '@/data/actions/db-actions/post';
import { PostGrid } from '@/components/castle/post-grid';
import { capitalize } from '@/lib/utils';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const { slug } = await params;

  const result = await postSelectFullAll();
  if (!result.success || !result.posts) {
    return <div>{result.message}</div>;
  }
  const posts = result.posts.filter(
    (post) => post.published && post.tags?.some((tag) => tag.slug === slug),
  );

  return (
    <>
      <h1 className={`text-3xl text-center mt-10`}>{capitalize(slug)}</h1>
      <PostGrid posts={posts} />;
    </>
  );
};

export default Page;
