import { auth } from "@/data/auth";
import { db } from "@/data/db";
import { SocialNetwork, socialNetworks, users } from "@/data/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { redirect } from "next/navigation";
import CreateSocial from "./CreateSocial";
import SocialTable from "./SocialTable";

const page = async () => {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const { user: sessionUser } = session;

  const allUsers = await db
    .select()
    .from(users)
    .where(eq(users.id, sessionUser.id!));
  const user = allUsers[0];

  const socials: SocialNetwork[] = await db
    .select()
    .from(socialNetworks)
    .where(eq(socialNetworks.userId, user.id!));

  return (
    <div>
      <h1>{user.name}</h1>
      <Image src={user.image || ""} alt={user.name!} width={300} height={300} />
      <SocialTable socials={socials} />
      <CreateSocial />
    </div>
  );
};

export default page;
