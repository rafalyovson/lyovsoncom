import { parseLexicalJSON } from '@/app/dungeon/ui/editor/data/serialize-deserialize.ts';
import { badgeVariants } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { postSelectFullOneBySlug } from '@/lib/actions/db-actions/post/post-select-full-one';
import { PostFull } from '@/data/types/post-full';

const PostHeader = async ({ post }: { post: PostFull }) => {
  return (
    <header className="flex flex-col-reverse items-center gap-12 lg:flex-row-reverse">
      <section className="flex flex-col gap-2 lg:w-1/2">
        <h1 className="text-4xl font-bold text-center lg:text-left">
          {post.title}
        </h1>
        <aside className="flex items-center justify-center gap-4 lg:justify-start">
          <p className="">
            <span className="text-sm ">by </span>
            <span className="underline">{post.author!.name}</span>
          </p>
          <p className="">
            <span className="text-sm ">on </span>
            <span className="underline">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </p>

          <section className="flex gap-2">
            {post.categories!.map((category: any) => (
              <Link
                className="underline"
                key={category.id}
                href={`/posts/categories/${category.slug}`}
              >
                {`@${category.name}`}
              </Link>
            ))}
          </section>
        </aside>

        <section className="flex gap-2 justify-center lg:justify-start">
          {post.tags!.map((tag: any) => (
            <Link
              className={badgeVariants({ variant: 'default' })}
              key={tag.id}
              href={`/posts/tags/${tag.slug}`}
            >
              {`#${tag.name}`}
            </Link>
          ))}
        </section>
      </section>
      <section className="flex justify-center lg:w-1/2">
        <Image
          src={post.featuredImage?.url || ''}
          alt={post.featuredImage?.altText || ''}
          width="600"
          height="600"
          className="rounded-lg shadow-lg "
        />
      </section>
    </header>
  );
};

const Page = async ({ params }: { params: any }) => {
  const { slug } = params;
  const result = await postSelectFullOneBySlug({ slug });
  if (!result.success || !result.post) {
    redirect('/posts');
  }

  return (
    <article className="flex flex-col w-full max-w-screen-lg gap-4 p-4 mx-auto my-4 rounded-lg shadow-lg">
      <PostHeader post={result.post} />
      <div className="container max-w-2xl mx-auto mt-4 text-lg leading-relaxed prose-xl dark:prose-invert ">
        {parseLexicalJSON(result.post.content)}
      </div>
    </article>
  );
};

export default Page;
