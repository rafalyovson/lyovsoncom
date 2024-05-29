"use server";

import { db } from "@/data/db";
import { NewSocialNetwork, socialNetworks } from "@/data/schema";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";

import { z } from "zod";

const createSocialSchema = createInsertSchema(socialNetworks, {
  name: z.string(),
  url: z.string().url(),
  userId: z.string().uuid(),
});

export const createSocial = async (userId: string, data: FormData) => {
  const payload: NewSocialNetwork = {
    name: data.get("name") as string,
    url: data.get("url") as string,
    userId: userId as string,
  };
  const isValid = createSocialSchema.safeParse(payload);
  if (!isValid.success) {
    revalidatePath("/account");
  } else {
    await db.insert(socialNetworks).values(payload);
    revalidatePath("/account");
  }
};

export const deleteSocial = async (id: string) => {
  console.log("deleting");

  await db.delete(socialNetworks).where(eq(socialNetworks.id, id));
  revalidatePath("/account");
};
