import { updatePost } from "@/app/dungeon/lib/postActions";
import PostForm from "@/app/dungeon/ui/PostForm";
import { prisma } from "@/app/lib/prisma";

const Page = async ({ params }: { params: { slug: string } }) => {
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      author: true,
    },
  });

  const updatePostWithId = updatePost.bind(null, post.id);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col p-10 space-y-6 border shadow-md border-dark dark:border-light w-96">
        <h1 className="text-2xl font-bold text-center">Update Post</h1>
        <PostForm post={post} action={updatePostWithId} />
      </div>
    </main>
  );
};

export default Page;
