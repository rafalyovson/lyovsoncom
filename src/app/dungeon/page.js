import DashHeader from "@/app/dungeon/ui/DashHeader.js";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/db.js";
import DashTable from "./ui/DashTable.js";

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
      <DashHeader user={user} />
      <DashTable posts={posts} />
    </main>
  );
};

export default Page;
