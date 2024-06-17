"use server";

import { db } from "@/data/db";
import { categories } from "@/data/schema";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const categoryCreate = async (
  _prevState: { message: string },
  formData: FormData
) => {
  const data = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
  };

  console.log("actionDataHere", data);

  const schema = createInsertSchema(categories, {
    name: z.string().min(1, { message: "Name is required" }),
    slug: z.string().min(1, { message: "Slug is required" }),
  });

  const parsedData = schema.safeParse(data);

  if (parsedData.success) {
    await db.insert(categories).values(data);
    console.log("success");
    revalidatePath("/dungeon/categories");
    return { message: "success" };
  } else {
    console.log("error", parsedData.error.issues);
    return { message: "error" };
  }
};
