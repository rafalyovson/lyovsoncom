import { Post } from '@/data/types/post';
import { PostCard } from './post-card';

export const PostGrid = async ({ posts }: { posts: Post[] }) => {
  return (
    <section className="p-8">
      <section className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {posts
          .map((post: Post) => <PostCard key={post.id} post={post} />)
          .reverse()}
      </section>
    </section>
  );
};
