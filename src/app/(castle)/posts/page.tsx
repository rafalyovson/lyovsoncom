import { PostGrid } from "@/app/(castle)/ui/post-grid";
import { getAllPosts, PostWithUser } from "@/lib/getAllPosts";

const page = async () => {
  const allPostsWithUsers: PostWithUser[] = await getAllPosts();

  const posts = allPostsWithUsers.filter((post) => post.post.published);
  return <PostGrid posts={posts} />;
};

export default page;
