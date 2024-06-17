import { Category } from "@/data/schema";
import { categoryCreate } from "@/lib/actions/category-create";
import { categoryGetAll } from "@/lib/actions/category-get-all";
import { CategoryForm } from "./category-form";
import { CategoryRow } from "./category-row";
const Page = async () => {
  const cats = await categoryGetAll();
  return (
    <>
      <main className="flex flex-col gap-4 p-4">
        <h1>Categories</h1>
        <section className="flex flex-col gap-2 p-4">
          {cats.map((cat: Category) => (
            <CategoryRow key={cat.id} cat={cat} />
          ))}
        </section>
      </main>
      <CategoryForm action={categoryCreate} />
    </>
  );
};

export default Page;
