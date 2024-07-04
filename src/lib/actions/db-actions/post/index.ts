import { PostFull, ResponseType } from '@/data/types';
import { Post } from '@/data/schema';

export type PostResponse = ResponseType;

export type PostAllResponse = ResponseType & {
  posts: Post[] | null;
};

export type PostOneResponse = ResponseType & {
  post: Post | null;
};

export type PostFullAllResponse = ResponseType & {
  posts: PostFull[] | null;
};

export type PostFullOneResponse = ResponseType & {
  post: PostFull | null;
};

export { postDeleteById } from './post-delete';
export { postInsert } from './post-insert';
export { postSelectOneById } from './post-select-one';
export { postSelectOneBySlug } from './post-select-one';
export { postUpdate } from './post-update';
export { postSelectFullOneBySlug } from './post-select-full-one';
export { postSelectAll } from '@/lib/actions/db-actions/post/post-select-all';
export { postSelectFullAll } from '@/lib/actions/db-actions/post/post-select-full-all';
