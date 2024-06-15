import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  avatar: text("avatar"),
  xLink: text("xLink"), // Field for X (Twitter) profile link
  redditLink: text("redditLink"), // Field for Reddit profile link
  linkedInLink: text("linkedInLink"), // Field for LinkedIn profile link
  githubLink: text("githubLink"), // Field for GitHub profile link
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
