import { images, users } from '@/data/schema';
import { InferSelectModel } from 'drizzle-orm';
import { SerializedEditorState } from 'lexical';

export type UserFull = InferSelectModel<typeof users> & {
  avatar?: InferSelectModel<typeof images>;
  longBio?: SerializedEditorState | null;
};
