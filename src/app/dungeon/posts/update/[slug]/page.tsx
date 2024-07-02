import { PostForm } from '@/app/dungeon/ui/post-form';
import { postUpdate } from '@/lib/actions/post-update';
import { redirect } from 'next/navigation';
import { postSelectFullBySlug } from '@/lib/actions/db-actions/post-select-full';

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  if (!slug) {
    redirect('/dungeon');
  }

  const result = await postSelectFullBySlug({ slug });

  if (!result.success || !result.post) {
    redirect('/dungeon/posts');
  }

  return (
    <main className=" mx-auto">
      <div className="flex flex-col p-10 space-y-6 border   ">
        <h1 className="text-2xl font-bold text-center">Update Post</h1>
        <PostForm post={result.post} action={postUpdate} />
      </div>
    </main>
  );
};

export default Page;
