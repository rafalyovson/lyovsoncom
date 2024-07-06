import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { boolean, json, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { PostType } from '../post-types';
import { images } from './image'; // Import the new images table
import { users } from './user';

export const posts = pgTable('post', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  content: json('content').notNull(),
  featuredImg: text('featuredImg'),
  published: boolean('published')
    .notNull()
    .$default(() => false),
  featured: boolean('featured')
    .notNull()
    .$default(() => false),
  createdAt: timestamp('createdAt', { mode: 'date' })
    .notNull()
    .$defaultFn(() => new Date()),
  authorId: text('authorId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull().unique(),
  type: text('type').notNull(),
  metadata: json('metadata'),
  featuredImageId: text('featured_image_id').references(() => images.id, {
    onDelete: 'set null',
  }), // Reference to image table
});

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

export const postInsertSchema = createInsertSchema(posts, {
  title: z.string().min(1, { message: 'Title is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  featuredImageId: z.string().min(1, { message: 'Image is required' }),
  authorId: z.string().uuid(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  createdAt: z.date(),
  type: z
    .nativeEnum(PostType, { message: 'Invalid post type' })
    .default(PostType.Article),
});

export const postSelectSchema = createSelectSchema(posts, {});
