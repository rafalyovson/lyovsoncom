import { prisma } from "../lib/db.js";
import PortfolioCard from "./PortfolioCard.js";

const data = await prisma.post.findMany({});
const Posts = () => (
  <section className="">
    <h2 className="mb-4 text-2xl text-center">Posts</h2>
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {data.map((post, index) => (
        <PortfolioCard key={index} post={post} />
      ))}
    </div>
  </section>
);

export default Posts;
