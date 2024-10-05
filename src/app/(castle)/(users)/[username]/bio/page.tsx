import { parseLexicalJSON } from '@/lib/utils';
import { userSelectFullOneByUsername } from '@/data/actions/db-actions/user/user-select-full-one';
import { redirect } from 'next/navigation';
import { SerializedEditorState } from 'lexical';

const Page = async (props: { params: Promise<{ username: string }> }) => {
  const params = await props.params;
  const { username } = await params;
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
        <h1 className="text-2xl">{`${result.user.name}'s Bio`}</h1>
        {parseLexicalJSON(result.user.longBio as SerializedEditorState)}
      </article>
    </>
  );
};

export default Page;
