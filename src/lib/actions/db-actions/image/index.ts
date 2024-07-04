import { ResponseType } from '@/data/types';
import { Image } from '@/data/schema';

export type ImageResponse = ResponseType;

export type ImageAllResponse = ResponseType & {
  images: Image[] | null;
};

export type ImageOneResponse = ResponseType & {
  image: Image | null;
};

export { imageDeleteByUrl } from './image-delete';
export { imageInsert } from './image-insert';
export { imageSelectById } from './image-select-one';
export { imageSelectBySlug } from './image-select-one';
export { imageUpdate } from './image-update';
export { imageSelectAll } from '@/lib/actions/db-actions/image/image-select-all';
