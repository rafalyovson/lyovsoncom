"use server";

import { db } from "@/data/db";
import { User, users } from "@/data/schema";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { redirect } from "next/navigation";

export const userUpdate = async (
  user: User,
  _prevState: any,
  formData: FormData
) => {
  const { username } = user;
  if (!username) {
    redirect("/dungeon/users");
  }

  const schema = createInsertSchema(users, {});
  const data = Object.fromEntries(formData);
  const parsedData = schema.safeParse(data);
  if (!parsedData.success) {
    console.log("Validation error", parsedData.error.issues);
    return;
  }
  await db.update(users).set(data).where(eq(users.username, username));
  redirect("/dungeon/users/" + username);
};
