import { redirect } from 'next/navigation';
import { ImageCard } from '@/components/dungeon/image-card';
import { parseLexicalJSON } from '@/lib/utils';
import { UserSocialMenu } from '@/components/user-soical-menu';
import { auth } from '@/data/auth';
import { userSelectFullOneById } from '@/data/actions/db-actions/user/user-select-full-one';
import { UserFull } from '@/data/types/user-full';
import { UserFullOneResponse } from '@/data/actions/db-actions/user';

const Page = async () => {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/dungeon/users');
  }
  const result: UserFullOneResponse = await userSelectFullOneById({
    id: session.user.id!,
  });
  if (!result.success || !result.user) {
    redirect('/dungeon/users');
  }

  const user: UserFull = result.user;
  return (
    <article className="flex flex-col md:flex-row gap-4 p-4">
      <section className={` `}>
        <ImageCard image={user.avatar!} />
      </section>
      <section className={`flex flex-col gap-2 `}>
        <h1 className="text-2xl font-bold ">{user.name}</h1>
        <p>{user.shortBio}</p>
        <UserSocialMenu user={user} />
        {user.longBio ? (
          <section className={`prose dark:prose-invert`}>
            {parseLexicalJSON(user.longBio!)}
          </section>
        ) : (
          <section className="flex flex-col gap-2 ">
            <p>No bio</p>
          </section>
        )}
      </section>
    </article>
  );
};

export default Page;
