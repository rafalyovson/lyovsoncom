import { PostGrid } from "@/app/(castle)/ui/post-grid";
import { postsGetAll } from "@/lib/actions/posts-get-all";

const page = async () => {
  const allPosts = await postsGetAll();
  if (!allPosts) {
    return <div>No posts</div>;
  }

  const posts = allPosts.filter((post) => post.published);
  return <PostGrid posts={posts} />;
};

export default page;
