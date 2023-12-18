import UploadForm from "@/app/dashboard/ui/UploadForm";
import { updatePost } from "@/app/lib/actions";
import { prisma } from "@/app/lib/db";
import Button from "@/app/ui/Button";
import TitleForm from "../../ui/TitleForm";

const Page = async ({ params }) => {
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
        <form action={updatePostWithId} className="flex flex-col space-y-4">
          <TitleForm value={post.title} />
          <label className="flex flex-col space-y-2">
            <span className="text-lg font-medium">Content:</span>
            <textarea
              name="content"
              defaultValue={post.content}
              required
              className="h-32 p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
          <span className="text-lg font-medium">Featured Image:</span>
          <UploadForm value={post.featuredImg} />

          {/* <label htmlFor="imageAlt" className="flex flex-col space-y-2">
            Alt Text
          </label>
          <input
            name="imageAlt"
            type="text"
            className="p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-blue-400"
          /> */}

          <Button type="submit" className="">
            Submit
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Page;
