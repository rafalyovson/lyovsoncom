import PostCard from "@/app/(castle)/ui/PostCard";
import { prisma } from "@/app/lib/prisma";
import { Post } from "@prisma/client";

const data = await prisma.post.findMany({});

const PostGrid = () => {
  if (!data) return <p className="text-xl text-center">Loading...</p>;
  return (
    <section className="p-8 ">
      <h2 className="mb-4 text-3xl text-center ">Posts</h2>
      <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {data
          .map((post: Post) => <PostCard key={post.id} post={post} />)
          .reverse()}
      </div>
    </section>
  );
};

export default PostGrid;
