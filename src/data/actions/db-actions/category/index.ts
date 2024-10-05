import { ResponseType } from '@/data/types';
import { Category } from '@/data/schema';

export type CategoryResponse = ResponseType;

export type CategoryAllResponse = ResponseType & {
  categories: Category[] | null;
};

export type CategoryOneResponse = ResponseType & {
  category: Category | null;
};

export { categoryDeleteById } from './category-delete';
export { categoryInsert } from './category-insert';
export { categorySelectOneById } from './category-select-one';
export { categorySelectOneBySlug } from './category-select-one';
export { categoryUpdate } from './category-update';
export { categorySelectAll } from '@/data/actions/db-actions/category/category-select-all';
