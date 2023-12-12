import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <>
      <h1>Welcome, {session?.user?.name}</h1>
      <Image
        alt={session?.user?.name + " photo"}
        src={session?.user?.image ?? ""}
        width={400}
        height={400}
      ></Image>
    </>
  );
};

export default Page;
