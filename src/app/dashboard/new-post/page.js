import UploadForm from "@/app/dashboard/ui/UploadForm";
import { createPost } from "@/app/lib/actions";
import TitleForm from "../ui/TitleForm";

const Page = async () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col p-10 space-y-6 border shadow-md border-dark dark:border-light w-96">
        <h1 className="text-2xl font-bold text-center">New Post</h1>
        <form action={createPost} className="flex flex-col space-y-4">
          <TitleForm />
          <label className="flex flex-col space-y-2">
            <span className="text-lg font-medium">Content:</span>
            <textarea
              name="content"
              required
              className="h-32 p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
          <span className="text-lg font-medium">Featured Image:</span>
          <UploadForm />

          {/* <label htmlFor="imageAlt" className="flex flex-col space-y-2">
            Alt Text
          </label>
          <input
            name="imageAlt"
            type="text"
            className="p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-blue-400"
          /> */}

          <button
            type="submit"
            className="px-4 py-2 text-white border border-beige "
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
};

export default Page;
