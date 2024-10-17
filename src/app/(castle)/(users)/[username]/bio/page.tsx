import { parseLexicalJSON } from '@/lib/utils';
import { userSelectFullOneByUsername } from '@/data/actions/db-actions/user/user-select-full-one';
import { redirect } from 'next/navigation';
import { SerializedEditorState } from 'lexical';

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const result = await userSelectFullOneByUsername({
    username,
  });

  if (!result.success || !result.user) {
    redirect('/');
  }
  const { user } = result;
  return (
    <>
      <title>{`${user.name}'s Bio | Lyovson.com`}</title>
      <article className="p-8 mx-auto prose dark:prose-invert lg:prose-xl">
        <h1 className="text-2xl">{`${user.name}'s Bio`}</h1>
        {parseLexicalJSON(user.longBio as SerializedEditorState)}
      </article>
    </>
  );
};

export default Page;
