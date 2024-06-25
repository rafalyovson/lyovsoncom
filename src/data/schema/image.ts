import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

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
