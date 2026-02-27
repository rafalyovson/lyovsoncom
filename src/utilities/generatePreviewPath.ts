import type { CollectionSlug } from "payload";

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: "/posts",
};

interface Props {
  collection: keyof typeof collectionPrefixMap;
  project?: unknown;
  slug: string;
}

export const generatePreviewPath = ({ collection, slug, project }: Props) => {
  if (collection === "posts") {
    if (
      project &&
      typeof project === "object" &&
      "slug" in project &&
      typeof project.slug === "string"
    ) {
      return `/${project.slug}/${slug}`;
    }
    return `/posts/${slug}`; // fallback if no project
  }

  return `/${collection}/${slug}`;
};
