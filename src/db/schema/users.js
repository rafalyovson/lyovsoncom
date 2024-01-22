// import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("imageUrl").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);

// export type User = InferSelectModel<typeof users>;
// export type NewUser = InferInsertModel<typeof users>;
