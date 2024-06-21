import { PostTable } from "@/app/dungeon/ui/post-table";
import { Post } from "@/data/types";
import { postsGetAll } from "@/lib/actions/posts-get-all";
import { capitalize } from "@/lib/utils";

type Params = {
  params: {
    slug?: string;
  };
};

const Posts = async ({ params }: Params) => {
  const { slug } = params;

  try {
    const allPosts: Post[] | null = await postsGetAll();

    if (!allPosts || allPosts.length === 0) {
      return <div>No posts available</div>;
    }

    if (!slug) {
      return <div>No category selected</div>;
    }

    const posts = allPosts.filter((post) =>
      post.categories?.some((cat) => cat.slug === slug)
    );

    if (posts.length === 0) {
      return <div>No posts found for this category</div>;
    }

    return (
      <main>
        <h1>Category: {capitalize(slug)}</h1>
        <PostTable posts={posts} />
      </main>
    );
  } catch (error) {
    console.error("Failed to fetch posts", error);
    return <div>Error fetching posts</div>;
  }
};

export default Posts;
