import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { categories } from "./category";
import { posts } from "./post";

export const categoryPost = pgTable(
  "category_post",
  {
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (cp) => ({
    compoundKey: primaryKey({
      columns: [cp.postId, cp.categoryId],
    }),
  })
);

export type CategoryPost = InferSelectModel<typeof categoryPost>;
export type NewCategoryPost = InferInsertModel<typeof categoryPost>;
