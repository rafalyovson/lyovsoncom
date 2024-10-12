import { parseLexicalJSON } from '@/lib/utils';
import { postSelectFullOneBySlug } from '@/data/actions/db-actions/post/post-select-full-one';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { GridCardNav } from '@/components/grid/grid-card-nav';
import { GridCardPost } from '@/components/grid/grid-card-post';

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
      siteName: 'Lyovson.com',
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
    <article className=" grid min-[420px]:grid-cols-1 max-[840px]:grid-cols-1 min-[840px]:grid-cols-2 max-w-[1260px] mx-auto gap-8 justify-center items-center min-[840px]:items-start">
      <header className={`flex flex-col gap-4 max-w-[400px] w-full mx-auto `}>
        <GridCardNav />
        <GridCardPost post={result.post} />
      </header>
      <div className=" max-w-[600px] p-4 mx-auto">
        {parseLexicalJSON(result.post.content)}
      </div>
    </article>
  );
};

export default Page;
