import PostTable from "@/app/dungeon/ui/postTable/PostTable.js";
import { auth } from "@/app/lib/auth.js";
import { prisma } from "@/app/lib/prisma.js";

const Page = async () => {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email ?? "",
    },
  });

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
