import { PostTable } from "@/app/dungeon/ui/post-table";
import { postsGetAll } from "@/lib/actions/posts-get-all";

const Posts = async () => {
  const posts = await postsGetAll();
  if (!posts) {
    return <div>No posts</div>;
  }

  return (
    <main>
      <PostTable posts={posts} />
    </main>
  );
};

export default Posts;
