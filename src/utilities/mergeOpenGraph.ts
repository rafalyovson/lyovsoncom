import type { Metadata } from "next";

import { getServerSideURL } from "./getURL";

const defaultOpenGraph: Metadata["openGraph"] = {
  type: "website",
  description: "The official website of Rafa and Jess Lyóvson.",
  images: [
    {
      url: `${getServerSideURL()}/og-image.png`,
    },
  ],
  siteName: "Lyovson.com",
  title: "Lyovson.com",
};

export const mergeOpenGraph = (
  og?: Metadata["openGraph"]
): Metadata["openGraph"] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  };
};
