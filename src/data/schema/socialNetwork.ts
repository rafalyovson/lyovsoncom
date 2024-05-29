import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./user";

export const socialNetworks = pgTable("socialNetwork", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name"),
  url: text("url"),
});

export type SocialNetwork = InferSelectModel<typeof socialNetworks>;
export type NewSocialNetwork = InferInsertModel<typeof socialNetworks>;
