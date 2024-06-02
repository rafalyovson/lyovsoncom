import { updatePost } from "@/app/dungeon/lib/postActions";
import { PostForm } from "@/app/dungeon/ui/PostForm";
import { getPostBySlug } from "@/lib/getPostBySlug";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { slug: string | undefined } }) => {
  if (!params.slug) {
    redirect("/dungeon");
  }
  const oldPost = await getPostBySlug(params.slug);

  if (!oldPost) {
    throw new Error("Post not found");
  }

  const updatePostWithId = updatePost.bind(null, oldPost.id);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col p-10 space-y-6 border shadow-md border-dark dark:border-light w-96">
        <h1 className="text-2xl font-bold text-center">Update Post</h1>
        <PostForm post={oldPost} action={updatePostWithId} />
      </div>
    </main>
  );
};

export default Page;
