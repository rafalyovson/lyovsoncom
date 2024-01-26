import PostTable from "@/app/dungeon/ui/postTable/PostTable";

import { prisma } from "@/app/lib/prisma";

const Page = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });

  return (
    <main>
      <PostTable posts={posts} />
    </main>
  );
};

export default Page;
