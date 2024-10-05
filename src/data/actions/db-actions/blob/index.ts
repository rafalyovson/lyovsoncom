import { BlobList, BlobMeta, ResponseType } from '@/data/types';

export type BlobResponse = ResponseType;

export type BlobAllResponse = ResponseType & {
  blobs: BlobList | null;
};

export type BlobOneResponse = ResponseType & {
  blobMeta: BlobMeta | null;
};

export { blobDelete } from './blob-delete';
export { blobInsert } from './blob-insert';
export { blobSelectAll } from './blob-select-all';
export { blobSelectOneByUrl } from './blob-select-one';
