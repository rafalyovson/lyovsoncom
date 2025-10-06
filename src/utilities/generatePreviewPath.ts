import type { CollectionSlug } from "payload";

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: "/posts",
};

type Props = {
  collection: keyof typeof collectionPrefixMap;
  slug: string;
  project?: any;
};

export const generatePreviewPath = ({ collection, slug, project }: Props) => {
  if (collection === "posts") {
    if (project && typeof project === "object") {
      return `/${project.slug}/${slug}`;
    }
    return `/posts/${slug}`; // fallback if no project
  }

  return `/${collection}/${slug}`;
};
