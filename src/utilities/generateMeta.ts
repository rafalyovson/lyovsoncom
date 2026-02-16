import type { Metadata } from "next";
import type { Post } from "@/payload-types";
import { getServerSideURL } from "./getURL";
import { mergeOpenGraph } from "./mergeOpenGraph";

type LegacyMeta = {
  meta?: {
    image?: Post["featuredImage"] | null;
    description?: string | null;
  } | null;
};

export const generateMeta = (args: { doc: Partial<Post> }): Metadata => {
  const { doc } = args;
  const legacyDoc = doc as Partial<Post> & LegacyMeta;

  // Use main fields with fallbacks to old meta fields during migration
  const postImage = doc?.featuredImage || legacyDoc.meta?.image;
  const ogImage =
    typeof postImage === "object" &&
    postImage !== null &&
    "url" in postImage &&
    postImage.url &&
    `${getServerSideURL()}${postImage.url}`;

  const title = doc?.title ? `${doc?.title} | Lyovson.com` : "Lyovson.com";
  const description = doc?.description || legacyDoc.meta?.description;

  return {
    description,
    openGraph: mergeOpenGraph({
      description: description || "",
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join("/") : "/",
    }),
    title,
  };
};
