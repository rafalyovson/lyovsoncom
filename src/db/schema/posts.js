// import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// model Post {
//     id          String           @id @default(cuid())
//     title       String
//     content     String
//     featuredImg String? // URL to the featured image
//     published   Boolean          @default(false)
//     createdAt   DateTime         @default(now())
//     author      User             @relation(fields: [authorId], references: [id])
//     authorId    String
//     slug        String           @unique
//     categories  CategoryOnPost[]
//     tags        TagOnPost[]
//     comments    Comment[]
//   }

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    image: text("imageUrl").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    authorId: integer("authorId").references(() => users.id),
  },
  (posts) => {
    return {
      uniqueIdx: uniqueIndex("title").on(posts.title),
    };
  }
);

// export type Post = InferSelectModel<typeof posts>;
// export type NewPost = InferInsertModel<typeof posts>;
