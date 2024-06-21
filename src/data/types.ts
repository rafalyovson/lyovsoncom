import { InferSelectModel } from "drizzle-orm";
import { categories, posts, tags, users } from "./schema";

export type Post = InferSelectModel<typeof posts> & {
  author?: InferSelectModel<typeof users>;
  categories?: InferSelectModel<typeof categories>[];
  tags?: InferSelectModel<typeof tags>[];
};
