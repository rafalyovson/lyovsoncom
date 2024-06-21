import { db } from "@/data/db";
import { users } from "@/data/schema";
import { postsGetAll } from "@/lib/actions/posts-get-all";
import { eq } from "drizzle-orm";
import { PostGrid } from "../../ui/post-grid";

const Page = async () => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, "rafa"));

  if (!user) {
    return <h1>User not found</h1>;
  }

  const posts = await postsGetAll();

  if (!posts) {
    return <h1>No posts found</h1>;
  }

  const jessPosts = posts.filter(
    (post) => post.author!.username === user.username
  );

  return (
    <>
      <h1>Jess</h1>
      <PostGrid posts={jessPosts} />
    </>
  );
};
export default Page;
