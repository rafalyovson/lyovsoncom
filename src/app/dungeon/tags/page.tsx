import { Tag } from "@/data/schema";
import { tagCreate } from "@/lib/actions/tag-create";
import { tagGetAll } from "@/lib/actions/tag-get-all";
import { TagForm } from "./tag-form";
import { TagRow } from "./tag-row";
const Page = async () => {
  const tags = await tagGetAll();
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
