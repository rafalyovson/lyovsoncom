import PostTable from "@/app/dungeon/ui/postTable/PostTable";
import { db } from "@/data/db";
import { Post, posts } from "@/data/schema";

const Page = async () => {
  const allPosts: Post[] = await db.select().from(posts);

  return (
    <main>
      <PostTable posts={allPosts} />
    </main>
  );
};

export default Page;
