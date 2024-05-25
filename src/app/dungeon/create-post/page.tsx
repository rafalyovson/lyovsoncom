import { createPost } from "@/app/dungeon/lib/postActions";
import PostForm from "@/app/dungeon/ui/PostForm";

const Page = async () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col p-10 space-y-6 border shadow-md border-dark dark:border-light ">
        <h1 className="text-2xl font-bold text-center">Create Post</h1>
        <PostForm action={createPost} />
      </div>
    </main>
  );
};

export default Page;
