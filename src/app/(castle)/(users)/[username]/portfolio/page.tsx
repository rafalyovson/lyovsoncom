import { userSelectFullOneByUsername } from '@/lib/actions/db-actions/user/user-select-full-one';
import { redirect } from 'next/navigation';

export async function Page({ params }: { params: { username: string } }) {
  const username = params.username;
  const result = await userSelectFullOneByUsername({
    username,
  });

  if (!result.success || !result.user) {
    redirect('/');
  }
  return (
    <h1
      className={`text-2xl text-center`}
    >{`${result.user.name}'s Portfolio`}</h1>
  );
}

export default Page;
