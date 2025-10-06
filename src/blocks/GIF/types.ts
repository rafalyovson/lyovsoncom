export type GIFBlock = {
  embedCode: {
    postId: string;
    aspectRatio: string;
  };
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
