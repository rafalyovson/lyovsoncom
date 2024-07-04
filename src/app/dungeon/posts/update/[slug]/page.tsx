import { PostForm } from '@/app/dungeon/ui/post-form';
import { postUpdate } from '@/lib/actions/server-actions/post-update';
import { redirect } from 'next/navigation';
import { postSelectFullOneBySlug } from '@/lib/actions/db-actions/post/post-select-full-one';

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  if (!slug) {
    redirect('/dungeon');
  }

  const result = await postSelectFullOneBySlug({ slug });

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
