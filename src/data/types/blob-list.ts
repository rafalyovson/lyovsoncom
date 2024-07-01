export type BlobList = {
  blobs: {
    size: number;
    uploadedAt: Date;
    pathname: string;
    url: string;
  }[];
  cursor?: string;
  hasMore: boolean;
  folders?: string[];
};
