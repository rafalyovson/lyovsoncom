import { PostTable } from "@/app/dungeon/ui/post-table";
import { getAllPosts, PostWithUser } from "@/lib/getAllPosts";

const Page = async () => {
  const allPostsWithUsers: PostWithUser[] = await getAllPosts();

  return (
    <main>
      <PostTable allPostsWithUsers={allPostsWithUsers} />
    </main>
  );
};

export default Page;
