import { db } from "@/data/db";
import { users } from "@/data/schema";
import { userUpdate } from "@/lib/actions/user-update";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import UserForm from "../../../ui/user-form";

const Page = async ({ params }: { params: any }) => {
  const { username } = params;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  if (!user) {
    redirect("/dungeon/users");
  }

  return (
    <article className="flex flex-col w-full max-w-screen-lg gap-4 p-4 mx-auto my-4 rounded-lg shadow-lg">
      <h1>{user.name}</h1>
      <UserForm action={userUpdate} user={user} />
    </article>
  );
};

export default Page;
