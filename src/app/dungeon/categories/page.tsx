import { Category } from '@/data/schema';
import { categorySelectAll } from '@/lib/actions/db-actions/category/category-select';
import { categoryCreateAction } from '@/lib/actions/server-actions/category-create';
import { CategoryForm } from './category-form';
import { CategoryRow } from './category-row';

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
