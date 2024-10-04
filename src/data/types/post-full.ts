import { categories, images, posts, tags, users } from '@/data/schema';
import { InferSelectModel } from 'drizzle-orm';
import { SerializedEditorState } from 'lexical';

export type PostFull = InferSelectModel<typeof posts> & {
  author?: InferSelectModel<typeof users>;
  categories?: InferSelectModel<typeof categories>[];
  tags?: InferSelectModel<typeof tags>[];
  featuredImage?: InferSelectModel<typeof images>;
  content: SerializedEditorState;
};
