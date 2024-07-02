import { PostForm } from '@/app/dungeon/ui/post-form';
import { postCreate } from '@/lib/actions/server-actions/post-create';

const Page = async () => {
  return (
    <main className=" mx-auto">
      <div className="flex flex-col p-10 space-y-6 border   ">
        <h1 className="text-2xl font-bold text-center">Create Post</h1>
        <PostForm action={postCreate} />
      </div>
    </main>
  );
};

export default Page;
