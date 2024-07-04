import { Tag } from '@/data/schema';
import { tagCreate } from '@/lib/actions/server-actions/tag-create';
import { TagForm } from './tag-form';
import { TagRow } from './tag-row';

import { tagSelectAll } from '@/lib/actions/db-actions/tag';

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
      <TagForm action={tagCreate} />
    </>
  );
};

export default Page;
