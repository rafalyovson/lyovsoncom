export type GIFBlock = {
  mp4Url: string;
  webmUrl?: string | null;
  posterUrl: string;
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
};
