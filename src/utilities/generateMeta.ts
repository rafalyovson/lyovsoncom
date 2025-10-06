import type { Metadata } from "next";
import type { Post } from "@/payload-types";
import { getServerSideURL } from "./getURL";
import { mergeOpenGraph } from "./mergeOpenGraph";

export const generateMeta = async (args: {
  doc: Partial<Post>;
}): Promise<Metadata> => {
  const { doc } = args || {};

  // Use main fields with fallbacks to old meta fields during migration
  const postImage = doc?.featuredImage || (doc as any)?.meta?.image;
  const ogImage =
    typeof postImage === "object" &&
    postImage !== null &&
    "url" in postImage &&
    postImage.url &&
    `${getServerSideURL()}${postImage.url}`;

  const title = doc?.title ? `${doc?.title} | Lyovson.com` : "Lyovson.com";
  const description = doc?.description || (doc as any)?.meta?.description;

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
