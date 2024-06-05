import { db } from "@/data/db";
import { users } from "@/data/schema";
import { getPostsByUser } from "@/lib/getAllPosts";
import { eq } from "drizzle-orm";
import { PostGrid } from "../../ui/post-grid";

const Page = async () => {
  const allUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, "hasmikkhachunts@gmail.com"));

  const [user] = allUsers;

  const posts = await getPostsByUser(user.email);

  return (
    <>
      <h1>Jess</h1>
      <PostGrid posts={posts} />
    </>
  );
};
export default Page;
