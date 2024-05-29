import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { posts } from "./post";
import { tags } from "./tag";

export const tagPost = pgTable(
  "tag_post",
  {
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (tp) => ({
    compoundKey: primaryKey({
      columns: [tp.postId, tp.tagId],
    }),
  })
);

export type TagPost = InferSelectModel<typeof tagPost>;
export type NewTagPost = InferInsertModel<typeof tagPost>;
