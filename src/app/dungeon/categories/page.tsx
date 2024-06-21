import { Category } from "@/data/schema";
import { categoriesGetAll } from "@/lib/actions/categories-get-all";
import { categoryCreate } from "@/lib/actions/category-create";
import { CategoryForm } from "./category-form";
import { CategoryRow } from "./category-row";
const Page = async () => {
  const cats = await categoriesGetAll();
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
