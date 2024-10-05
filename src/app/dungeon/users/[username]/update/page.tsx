import { userUpdateAction } from '@/lib/actions/server-actions/user/user-update-action';
import { redirect } from 'next/navigation';
import UserForm from '../../../ui/user-form';
import { userSelectFullOneByUsername } from '@/lib/actions/db-actions/user/user-select-full-one';
import { imageSelectAll } from '@/lib/actions/db-actions/image';

const Page = async (props: { params: Promise<{ username: string }> }) => {
  const params = await props.params;
  const { username } = await params;

  const userResult = await userSelectFullOneByUsername({ username });

  if (!userResult.success || !userResult.user) {
    redirect('/dungeon/users');
  }

  const imageResult = await imageSelectAll();
  if (!imageResult.success || !imageResult.images) {
    redirect('/dungeon/users');
  }

  return (
    <article className="flex flex-col w-full max-w-screen-lg gap-4 p-4 mx-auto my-4 rounded-lg shadow-lg">
      <h1>{userResult.user.name}</h1>
      <UserForm action={userUpdateAction} user={userResult.user} />
    </article>
  );
};

export default Page;
