import { redirect } from 'next/navigation';
import { userSelectFullOneByUsername } from '@/lib/actions/db-actions/user/user-select-full-one';

const Page = async ({ params }: { params: any }) => {
  const result = await userSelectFullOneByUsername({
    username: params.username,
  });

  if (!result.success || !result.user) {
    redirect('/dungeon/users');
  }
  return (
    <article className="flex flex-col w-full max-w-screen-lg gap-4 p-4 mx-auto my-4 rounded-lg shadow-lg">
      <h1>{result.user.name}</h1>
    </article>
  );
};

export default Page;
