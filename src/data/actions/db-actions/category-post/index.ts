import { ResponseType } from '@/data/types';
import { CategoryPost } from '@/data/schema';

export type CategoryPostResponse = ResponseType;

export type CategoryPostAllResponse = ResponseType & {
  categoryPosts: CategoryPost[] | null;
};

export type CategoryPostOneResponse = ResponseType & {
  categoryPost: CategoryPost | null;
};

export { categoryPostInsert } from './category-post-insert';
export { categoryPostDelete } from './category-post-delete';
export { categoryPostSelectOnePost } from './category-post-select-one-post';
