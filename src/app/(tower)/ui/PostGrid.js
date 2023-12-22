import PostCard from "@/app/(tower)/ui/PostCard";
import { prisma } from "@/app/lib/db";

const data = await prisma.post.findMany({});

const PostGrid = () => {
  if (!data)
    return (
      <p className="text-xl text-center text-gray-600 dark:text-gray-300">
        Loading...
      </p>
    );
  return (
    <section className="p-8 rounded-lg shadow-lg bg-gray-50 dark:bg-dark">
      <h2 className="mb-4 text-3xl text-center text-gray-700 dark:text-light">
        Posts
      </h2>
      <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {data.map((post) => <PostCard key={post.id} post={post} />).reverse()}
      </div>
    </section>
  );
};

export default PostGrid;
