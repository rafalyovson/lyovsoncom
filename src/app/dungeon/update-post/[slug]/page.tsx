import { updatePost } from "@/app/dungeon/lib/postActions";
import ContentForm from "@/app/dungeon/ui/postForm/ContentForm";
import TitleForm from "@/app/dungeon/ui/postForm/TitleForm";
import UploadForm from "@/app/dungeon/ui/postForm/imageForm/UploadForm";
import { prisma } from "@/app/lib/prisma";
import Button from "@/app/ui/Button";

const Page = async ({ params }: { params: { slug: string } }) => {
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      author: true,
    },
  });

  const updatePostWithId = updatePost.bind(null, post.id);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col p-10 space-y-6 border shadow-md border-dark dark:border-light w-96">
        <h1 className="text-2xl font-bold text-center">Update Post</h1>
        {/* @ts-ignore */}
        <form action={updatePostWithId} className="flex flex-col space-y-4">
          <TitleForm value={post.title} />
          <ContentForm value={post.content} />
          <UploadForm value={post.featuredImg} />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </main>
  );
  // @ts-ignore
};

export default Page;
