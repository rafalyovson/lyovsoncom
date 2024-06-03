import PostCard from "@/app/(castle)/ui/PostCard";
import { PostWithUser, getAllPosts } from "@/lib/getAllPosts";

const PostGrid = async () => {
  const allPostsWithUsers: PostWithUser[] = await getAllPosts();

  const posts = allPostsWithUsers.filter((post) => post.post.published);

  return (
    <section className="p-8 ">
      <h2 className="mb-4 text-3xl text-center ">Posts</h2>
      <section className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {posts
          .map((postWithUser: PostWithUser) => (
            <PostCard key={postWithUser.post.id} postWithUser={postWithUser} />
          ))
          .reverse()}
      </section>
    </section>
  );
};

export default PostGrid;
