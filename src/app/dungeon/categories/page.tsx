import { Category } from '@/data/schema';
import { categoryCreateAction } from '@/data/actions/server-actions/category/category-create-action';
import { CategoryForm } from './category-form';
import { CategoryRow } from './category-row';
import { categorySelectAll } from '@/data/actions/db-actions/category';

const Page = async () => {
  const result = await categorySelectAll();
  if (!result.success || !result.categories) {
    return <div>{result.message}</div>;
  }

  const cats = result.categories;
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
      <CategoryForm action={categoryCreateAction} />
    </>
  );
};

export default Page;
