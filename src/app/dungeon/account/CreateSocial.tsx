"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SessionContext } from "next-auth/react";
import { use } from "react";
import { createSocial } from "./actions";

const CreateSocial = () => {
  const session = use(SessionContext);
  if (!session) return null;
  const data = session.data as any;
  const { user } = data;
  const createSocialWithUser = createSocial.bind(null, user.id);

  return (
    <form
      className=" flex flex-col gap-4 max-w-[600px] mx-auto my-10"
      action={createSocialWithUser}
    >
      <Label htmlFor="name">Name</Label>
      <Input name="name" />
      <Label htmlFor="name">Url</Label>
      <Input name="url" />
      <Button type="submit">Add Social Network</Button>
    </form>
  );
};

export default CreateSocial;
