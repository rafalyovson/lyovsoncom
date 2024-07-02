import { redirect } from "next/navigation";
import UserForm from "../../ui/user-form";
import {userUpdate} from "@/lib/actions/user-update";
import {getUserByUsername} from "@/lib/actions/db-actions/user-select";

const Page = async ({ params }: { params: any }) => {
  const {user} = await  getUserByUsername({username: params.username})

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
