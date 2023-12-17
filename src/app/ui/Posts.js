import { prisma } from "../lib/db.js";
import PostCard from "./PostCard.js";

const data = await prisma.post.findMany({});
const Posts = () => (
  <section className="p-8 bg-gray-100 rounded-lg shadow-lg">
    <h2 className="mb-4 text-3xl text-center text-blue-600">Posts</h2>
    <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {data.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
    </div>
  </section>
);

export default Posts;
