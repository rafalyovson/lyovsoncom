import { redirect } from 'next/navigation';
import { userSelectFullOneByUsername } from '@/data/actions/db-actions/user/user-select-full-one';
import { ImageCard } from '@/components/dungeon/image-card';
import { parseLexicalJSON } from '@/lib/utils';
import { UserSocialMenu } from '@/components/user-soical-menu';
import { UserFull } from '@/data/types/user-full';

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const result = await userSelectFullOneByUsername({ username });

  if (!result.success || !result.user) {
    redirect('/dungeon/users');
  }

  const user = result.user as UserFull;
  return (
    <article className="flex flex-col md:flex-row gap-4 p-4">
      <section className={` `}>
        <ImageCard image={user.avatar!} />
      </section>
      <section className={`flex flex-col gap-2 `}>
        <h1 className="text-2xl font-bold ">{user.name}</h1>
        <p>{result.user.shortBio}</p>
        <UserSocialMenu user={result.user} />
        {result.user.longBio ? (
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
