import { PostForm } from "@/app/dungeon/ui/post-form";
import { postUpdate } from "@/lib/actions/post-update";
import { getPostBySlug } from "@/lib/getPostBySlug";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { slug: string | undefined } }) => {
  if (!params.slug) {
    redirect("/dungeon");
  }
  const post = await getPostBySlug(params.slug);

  if (!post) {
    throw new Error("Post not found");
  }

  return (
    <main className=" mx-auto">
      <div className="flex flex-col p-10 space-y-6 border   ">
        <h1 className="text-2xl font-bold text-center">Update Post</h1>
        <PostForm post={post} action={postUpdate} />
      </div>
    </main>
  );
};

export default Page;
