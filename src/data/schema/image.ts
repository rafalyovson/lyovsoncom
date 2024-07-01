import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const images = pgTable("image", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull(),
  url: text("url").notNull(),
  caption: text("name"),
  altText: text("alt_text"),
  group: text("type").notNull(), // E.g., "postImage", "userImage"
});

export type Image = InferSelectModel<typeof images>;
export type NewImage = InferInsertModel<typeof images>;

export const imageInsertSchema = createInsertSchema(images, {
  caption: z.string().min(1, { message: "Caption is required" }),
  altText: z.string().min(1, { message: "Alt Text is required" }),
  group: z.string().min(1, { message: "Group is required" }),
  url: z.string().url().min(1, { message: "Image is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
});

export const imageSelectSchema = createSelectSchema(images, {});
