import { PostTable } from "@/app/dungeon/ui/PostTable";
import { getAllPosts, PostWithUser } from "@/lib/getAllPosts";

const Posts = async () => {
  const allPostsWithUsers: PostWithUser[] = await getAllPosts();

  return (
    <main>
      <PostTable allPostsWithUsers={allPostsWithUsers} />
    </main>
  );
};

export default Posts;
