"use server";

import { db } from "@/data/db";
import { tags } from "@/data/schema";
import { capitalize } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const tagCreate = async (
  _prevState: { message: string },
  formData: FormData
) => {
  const data = {
    name: capitalize(formData.get("name") as string),
    slug: formData.get("slug") as string,
  };

  const existingTag = await db
    .select()
    .from(tags)
    .where(eq(tags.name, data.name));

  if (existingTag.length > 0) {
    return { message: "Tag already exists" };
  }

  const schema = createInsertSchema(tags, {
    name: z.string().min(1, { message: "Name is required" }),
    slug: z.string().min(1, { message: "Slug is required" }),
  });

  const parsedData = schema.safeParse(data);

  if (parsedData.success) {
    await db.insert(tags).values(data);
    revalidatePath("/dungeon/tags");
    return { message: "success" };
  } else {
    return { message: "error" };
  }
};
