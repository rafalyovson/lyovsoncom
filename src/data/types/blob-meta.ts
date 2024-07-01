export type BlobMeta = {
  size: number;
  uploadedAt: Date;
  pathname: string;
  contentType: string;
  contentDisposition: string;
  url: string;
  cacheControl: string;
};
