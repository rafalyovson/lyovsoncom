import { auth } from "@/app/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { prisma } from "../lib/db";

const Page = async () => {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email ?? "",
    },
  });

  return (
    <>
      <h1>Welcome, {session?.user?.name}</h1>
      <Image
        alt={user!.name + " photo"}
        src={user!.image ?? ""}
        width={400}
        height={400}
      ></Image>
    </>
  );
};

export default Page;
