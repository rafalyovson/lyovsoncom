import { redirect } from 'next/navigation';
import { userSelectFullOneByUsername } from '@/lib/actions/db-actions/user/user-select-full-one';
import { ImageCard } from '@/app/dungeon/ui/image-card';
import { parseLexicalJSON } from '@/app/dungeon/ui/editor/data/serialize-deserialize.ts';
import { UserSocialMenu } from '@/components/user-soical-menu';

const Page = async ({ params }: { params: any }) => {
  const result = await userSelectFullOneByUsername({
    username: params.username,
  });

  if (!result.success || !result.user) {
    redirect('/dungeon/users');
  }
  return (
    <article className="flex flex-col md:flex-row gap-4 p-4">
      <section className={` `}>
        <ImageCard image={result.user.avatar!} />
      </section>
      <section className={`flex flex-col gap-2 `}>
        <h1 className="text-2xl font-bold ">{result.user.name}</h1>
        <p>{result.user.shortBio}</p>
        <UserSocialMenu user={result.user} />
        {result.user.longBio ? (
          <section className={`prose dark:prose-invert`}>
            {parseLexicalJSON(result.user.longBio)}
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
