import { PostForm } from "@/app/dungeon/ui/post-form";
import { postGetFull } from "@/lib/actions/post-get-full";
import { postUpdate } from "@/lib/actions/post-update";
import { redirect } from "next/navigation";
const Page = async ({ params }: { params: { slug: string | undefined } }) => {
  if (!params.slug) {
    redirect("/dungeon");
  }

  const fullPost = await postGetFull(params.slug);

  console.log("🐤", fullPost);

  return (
    <main className=" mx-auto">
      <div className="flex flex-col p-10 space-y-6 border   ">
        <h1 className="text-2xl font-bold text-center">Update Post</h1>
        <PostForm post={fullPost} action={postUpdate} />
      </div>
    </main>
  );
};

export default Page;
