import { parseLexicalJSON } from "@/app/dungeon/ui/editor/data/serialize-deserialize.ts";
import { postGetFull } from "@/lib/actions/post-get-full";
import Image from "next/image";
import { redirect } from "next/navigation";

const PostHeader = async ({ post }: { post: any }) => {
  console.log("🐤", post);
  return (
    <header className="flex flex-col-reverse items-center gap-12 lg:flex-row-reverse">
      <section className="flex flex-col gap-2 lg:w-1/2">
        <h1 className="text-4xl font-bold text-center lg:text-left">
          {post.title}
        </h1>
        <aside className="flex items-center justify-center gap-4 lg:justify-start">
          <p className="">
            <span className="text-sm ">by </span>
            <span className="underline">{post.author.name}</span>
          </p>
          <p className="">
            <span className="text-sm ">on </span>
            <span className="underline">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </p>
        </aside>
      </section>
      <section className="flex justify-center lg:w-1/2">
        <Image
          className="rounded-lg shadow-lg "
          src={post.featuredImage?.url || ""}
          alt={post.featuredImage?.altText || ""}
          width="600"
          height="600"
        />
      </section>
    </header>
  );
};

const Page = async ({ params }: { params: any }) => {
  const { slug } = params;
  const post = await postGetFull(slug);
  if (!post) {
    redirect("/dungeon/posts");
  }

  return (
    <article className="flex flex-col w-full max-w-screen-lg gap-4 p-4 mx-auto my-4 rounded-lg shadow-lg">
      <PostHeader post={post} />
      <div className="container max-w-2xl mx-auto mt-4 text-lg leading-relaxed">
        {parseLexicalJSON(post.content)}
      </div>
    </article>
  );
};

export default Page;
