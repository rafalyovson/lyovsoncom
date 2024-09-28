import { parseLexicalJSON } from '@/app/dungeon/ui/editor/data/serialize-deserialize.ts';
import { userSelectFullOneByUsername } from '@/lib/actions/db-actions/user/user-select-full-one';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: { username: string } }) => {
  const username = params.username;
  const result = await userSelectFullOneByUsername({
    username,
  });

  if (!result.success || !result.user) {
    redirect('/');
  }
  return (
    <>
      <title>{`${result.user.name}'s Bio | Lyovson.com`}</title>

      <article className="p-8 mx-auto prose dark:prose-invert lg:prose-xl">
        <h1 className={`text-2xl `}>{`${result.user.name}'s Bio`}</h1>
        {parseLexicalJSON(result.user.longBio)}
      </article>
    </>
  );
};

export default Page;
