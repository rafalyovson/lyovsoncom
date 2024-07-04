import { ResponseType } from '@/data/types';
import { Tag } from '@/data/schema';

export type TagResponse = ResponseType;

export type TagAllResponse = ResponseType & {
  tags: Tag[] | null;
};

export type TagOneResponse = ResponseType & {
  tag: Tag | null;
};

export { tagDelete } from './tag-delete';
export { tagInsert } from './tag-insert';
export { tagSelectOneById } from './tag-select-one';
export { tagSelectOneBySlug } from './tag-select-one';
export { tagUpdate } from './tag-update';
export { tagSelectAll } from '@/lib/actions/db-actions/tag/tag-select-all';
