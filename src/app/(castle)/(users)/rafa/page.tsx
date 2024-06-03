import { db } from "@/data/db";
import { users } from "@/data/schema";
import { getPostsByUser } from "@/lib/getAllPosts";
import { eq } from "drizzle-orm";
import { PostGrid } from "../../ui/post-grid";

export async function Page() {
  const allUsers = await db
    .select()
    .from(users)
    .where(eq(users.name, "Rafa Lyovson"));

  const [user] = allUsers;

  const posts = await getPostsByUser(user.email);

  return (
    <>
      <h1>Rafa</h1>
      <PostGrid posts={posts} />
    </>
  );
}
export default Page;
