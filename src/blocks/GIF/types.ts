export type GIFBlock = {
  mp4Url?: string | null;
  webmUrl?: string | null;
  posterUrl?: string | null;
  aspectRatio?: string | null;
  caption?: {
    root: {
      // biome-ignore lint/suspicious/noExplicitAny: <!-- Ignore -->
      children: any[];
      direction: null | "ltr" | "rtl";
      format: string;
      indent: number;
      type: string;
      version: number;
    };
  };
  blockType: "gif";
  // Legacy fields for backwards compatibility (deprecated)
  embedCode?: {
    raw?: string | null;
    postId?: string | null;
    aspectRatio?: string | null;
  };
};
