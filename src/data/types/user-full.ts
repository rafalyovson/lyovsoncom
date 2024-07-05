import { images, users } from '@/data/schema';
import { InferSelectModel } from 'drizzle-orm';

export type UserFull = InferSelectModel<typeof users> & {
  avatar?: InferSelectModel<typeof images>;
};
