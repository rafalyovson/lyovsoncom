import { parseLexicalJSON } from '@/app/dungeon/ui/editor/data/serialize-deserialize';
import { badgeVariants } from '@/components/ui/badge';
import { PostFull } from '@/data/types/post-full';
import { postSelectFullOneBySlug } from '@/lib/actions/db-actions/post/post-select-full-one';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Category, Tag } from '@/data/schema';
import { Calendar, User } from 'lucide-react';

const PostHeader = async ({ post }: { post: PostFull }) => {
  return (
    <header className="flex flex-col-reverse lg:flex-row-reverse lg:items-center lg:gap-12 gap-6 p-6 bg-gradient-to-r from-[#1c1c1e] to-[#121212] rounded-lg shadow-lg">
      {/* Featured Image */}
      <section className="flex justify-center w-full lg:w-1/2">
        <Image
          src={post.featuredImage?.url || '/placeholder-image.jpg'}
          alt={post.featuredImage?.altText || 'Featured image'}
          width={600}
          height={600}
          className="rounded-lg shadow-md object-cover w-full h-auto max-h-96 lg:max-h-full transform transition-transform duration-500 hover:scale-105"
          priority
          placeholder="blur"
          blurDataURL="/placeholder-image.jpg"
        />
      </section>

      {/* Post Details */}
      <section className="flex flex-col gap-4 lg:w-1/2 p-6 bg-card rounded-lg shadow-sm">
        {/* Post Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-center lg:text-left leading-snug lg:leading-tight text-gray-100">
          {post.title}
        </h1>

        {/* Author, Date, and Categories */}
        <aside className="flex flex-col gap-2 lg:gap-4 text-gray-400">
          {/* Author */}
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <User className="text-primary w-5 h-5" />
            <p className="text-base lg:text-lg">
              <span className="text-sm">by </span>
              <span className="font-medium text-gray-100">
                {post.author!.name}
              </span>
            </p>
          </div>
          {/* Date */}
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <Calendar className="text-primary w-5 h-5" />
            <p className="text-base lg:text-lg">
              <span className="text-sm">on </span>
              <span className="text-gray-100">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>

          {/* Categories */}
          <section className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {post.categories!.map((category: Category) => (
              <Link
                className="text-blue-400 underline hover:text-blue-300 transition-colors"
                key={category.id}
                href={{ pathname: `/posts/categories/${category.slug}` }}
              >
                {`@${category.name}`}
              </Link>
            ))}
          </section>
        </aside>

        {/* Tags */}
        <section className="flex flex-wrap gap-2 justify-center lg:justify-start">
          {post.tags!.map((tag: Tag) => (
            <Link
              className={`${badgeVariants({
                variant: 'default',
              })} py-1 px-2 rounded-md text-gray-200 bg-[#1c1c1e] hover:bg-primary hover:text-background transition-colors`}
              key={tag.id}
              href={{ pathname: `/posts/tags/${tag.slug}` }}
            >
              {`#${tag.name}`}
            </Link>
          ))}
        </section>
      </section>
    </header>
  );
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const result = await postSelectFullOneBySlug({ slug });

  // Redirect if post not found
  if (!result.success || !result.post) {
    redirect('/posts');
  }

  return (
    <article className="flex flex-col w-full max-w-screen-lg gap-8 mx-auto p-4 sm:p-6 md:p-8 rounded-lg shadow-lg bg-[#09090B]">
      {/* Post Header */}
      <PostHeader post={result.post} />

      {/* Post Content */}
      <div className=" max-w-2xl mx-auto mt-6  text-gray-200 leading-relaxed">
        {parseLexicalJSON(result.post.content)}
      </div>
    </article>
  );
};

export default Page;
