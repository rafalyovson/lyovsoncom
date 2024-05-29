"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { socialNetworks } from "@/data/schema";
import { createInsertSchema } from "drizzle-zod";
import { SessionContext } from "next-auth/react";
import { use } from "react";
import { z } from "zod";
import { createSocial } from "./actions";

const createSocialSchema = createInsertSchema(socialNetworks, {
  name: z.string(),
  url: z.string().url(),
  userId: z.string().uuid(),
});

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
