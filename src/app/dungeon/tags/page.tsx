import { Tag } from '@/data/schema';
import { tagCreateActions } from '@/data/actions/server-actions/tag/tag-create-actions';
import { TagForm } from './tag-form';
import { TagRow } from './tag-row';

import { tagSelectAll } from '@/data/actions/db-actions/tag';

const Page = async () => {
  const result = await tagSelectAll();
  if (!result.success || !result.tags) {
    return <div>{result.message}</div>;
  }

  const tags = result.tags;
  return (
    <>
      <main className="flex flex-col gap-4 p-4">
        <h1>Tags</h1>
        <section className="flex flex-col gap-2 p-4">
          {tags.map((tag: Tag) => (
            <TagRow key={tag.id} cat={tag} />
          ))}
        </section>
      </main>
      <TagForm action={tagCreateActions} />
    </>
  );
};

export default Page;
