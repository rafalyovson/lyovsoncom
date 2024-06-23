import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { images } from "./image"; // Import the new images table
import { users } from "./user";

export const posts = pgTable("post", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  content: json("content").notNull(),
  featuredImg: text("featuredImg"),
  published: boolean("published")
    .notNull()
    .$default(() => false),
  createdAt: timestamp("createdAt", { mode: "date" })
    .notNull()
    .$defaultFn(() => new Date()),
  authorId: text("authorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull(),
  metadata: json("metadata"),
  featuredImageId: text("featured_image_id").references(() => images.id, {
    onDelete: "set null",
  }), // Reference to image table
});

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;
