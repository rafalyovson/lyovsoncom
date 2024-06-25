import { PostTable } from "@/app/dungeon/ui/post-table";
import { postsGetAll } from "@/lib/actions/posts-get-all";
import { PageHeader } from "../ui/page-header";

const Posts = async () => {
  const posts = await postsGetAll();

  return (
    <main>
      <PageHeader title="Posts" link="/dungeon/posts/create" />
      {posts && <PostTable posts={posts} />}
    </main>
  );
};

export default Posts;
