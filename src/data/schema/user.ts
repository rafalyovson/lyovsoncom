import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text("username").unique(),
  isLyovson: boolean("isLyovson").default(false),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  bio: text("bio"),
  image: text("image"),
  xLink: text("xLink"),
  redditLink: text("redditLink"),
  linkedInLink: text("linkedInLink"),
  githubLink: text("githubLink"),
  youtubeLink: text("youtubeLink"),
  links: json("links"),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
