import { auth } from "@/data/auth";
import { db } from "@/data/db";
import { User, users } from "@/data/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const getCurrentUser = async (): Promise<User> => {
  const session = await auth();

  if (!session || !session?.user) {
    redirect("/api/auth/signin");
  }

  const allUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, session?.user?.email!));
  return allUsers[0];
};

export const currentUser = getCurrentUser();
