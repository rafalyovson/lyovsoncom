import { PostGrid } from '@/components/castle/post-grid';
import { About } from '@/components/castle/about';
import { postSelectFullAll } from '@/data/actions/db-actions/post';

export default async function HomePage() {
  const result = await postSelectFullAll();
  if (!result.success || !result.posts) {
    return <div>{result.message}</div>;
  }

  return (
    <>
      <main className="flex flex-col items-center gap-12 p-6 sm:p-8 md:p-12 lg:p-16 bg-background text-gray-800 dark:text-gray-200">
        <About />
        <section className="w-full max-w-screen-xl px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary dark:text-primary-light mb-8 text-center lg:text-left">
            Latest Posts
          </h2>
          <PostGrid posts={result.posts} />
        </section>
      </main>
    </>
  );
}
