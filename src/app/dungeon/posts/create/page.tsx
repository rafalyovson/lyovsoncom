import { InputForm } from "@/app/dungeon/ui/post-form";

const Page = async () => {
  return (
    <main className="max-w-[600px] mx-auto">
      <div className="flex flex-col p-10 space-y-6 border   ">
        <h1 className="text-2xl font-bold text-center">Create Post</h1>
        {/* <PostForm action={createPost} /> */}
        <InputForm />
      </div>
    </main>
  );
};

export default Page;
