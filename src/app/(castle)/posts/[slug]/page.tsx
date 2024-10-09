import { parseLexicalJSON } from '@/lib/utils';
import { postSelectFullOneBySlug } from '@/data/actions/db-actions/post/post-select-full-one';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { PostHeader } from '@/components/castle/post-header';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const result = await postSelectFullOneBySlug({ slug });

  if (!result.success || !result.post) {
    return {
      title: 'Post Not Found - Lyovson',
      description: 'The requested post could not be found.',
    };
  }

  const post = result.post;

  return {
    title: post.title || 'Lyovson',
    description: post.title || 'Read this post on Lyovson.com.',
    openGraph: {
      title: post.title,
      description: post.title || 'Read this post on Lyovson.com.',
      url: `https://lyovson.com/posts/${slug}`,
      images: [
        {
          url: post.featuredImage?.url || '/default-og-image.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.title || 'Read this post on Lyovson.com.',
      images: [post.featuredImage || '/default-twitter-image.jpg'],
    },
  };
}

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const { slug } = await params;
  const result = await postSelectFullOneBySlug({ slug });

  // Redirect if post not found
  if (!result.success || !result.post) {
    redirect('/posts');
  }

  return (
    <article className="flex flex-col w-full max-w-screen-lg gap-12 mx-auto p-6 sm:p-8 md:p-10 rounded-xl shadow-xl bg-[#f0f0f0] dark:bg-[#09090B]">
      {/* Post Header */}
      <PostHeader post={result.post} />

      {/* Post Content */}
      <div className="max-w-2xl mx-auto mt-8 text-gray-800 dark:text-gray-300 leading-relaxed text-lg">
        {parseLexicalJSON(result.post.content)}
      </div>
    </article>
  );
};

export default Page;
