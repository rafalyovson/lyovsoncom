import { db } from "@/data/db";
import { users } from "@/data/schema";

export const usersGetAll = async () => {
  const allUsers = await db.select().from(users);
  return allUsers;
};
