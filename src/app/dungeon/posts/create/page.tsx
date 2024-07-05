import { PostForm } from '@/app/dungeon/ui/post-form';
import { postCreateAction } from '@/lib/actions/server-actions/post/post-create-action';

const Page = async () => {
  return (
    <main className=" mx-auto">
      <div className="flex flex-col p-10 space-y-6 border   ">
        <h1 className="text-2xl font-bold text-center">Create Post</h1>
        <PostForm action={postCreateAction} />
      </div>
    </main>
  );
};

export default Page;
