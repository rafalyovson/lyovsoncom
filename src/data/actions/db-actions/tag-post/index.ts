import { ResponseType } from '@/data/types';
import { TagPost } from '@/data/schema';

export type TagPostResponse = ResponseType;

export type TagPostAllResponse = ResponseType & {
  tagPosts: TagPost[] | null;
};

export type TagPostOneResponse = ResponseType & {
  tagPost: TagPost | null;
};

export { tagPostDelete } from './tag-post-delete';
export { tagPostSelectOnePost } from './tag-post-select-one-post';
export { tagPostInsert } from './tag-post-insert';
