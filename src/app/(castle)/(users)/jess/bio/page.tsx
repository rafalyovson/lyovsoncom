import { parseLexicalJSON } from '@/app/dungeon/ui/editor/data/serialize-deserialize.ts';
import { redirect } from 'next/navigation';
import { userSelectFullOneByUsername } from '@/lib/actions/db-actions/user/user-select-full-one';

const Page = async () => {
  const result = await userSelectFullOneByUsername({
    username: 'jess',
  });

  if (!result.success || !result.user) {
    redirect('/jess');
  }
  return (
    <>
      <title>Jess Lyovson&apos;s Bio | Lyovson.com</title>

      <article className="p-8 mx-auto prose dark:prose-invert lg:prose-xl">
        <h1>Jess Lyovson&apos;s Bio</h1>
        {parseLexicalJSON(result.user.longBio)}
      </article>
    </>
  );
};

export default Page;
