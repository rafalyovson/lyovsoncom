import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";

import { GridCardProject } from "@/components/grid/card/project";
import { SkeletonGrid } from "@/components/grid/skeleton";
import { JsonLd } from "@/components/JsonLd";
import { generateCollectionPageSchema } from "@/utilities/generate-json-ld";
import { getProjects } from "@/utilities/get-projects";
import { getServerSideURL } from "@/utilities/getURL";

export default async function Page() {
  "use cache";

  // Add cache tags for Jess's posts
  cacheTag("posts");
  cacheTag("users");
  cacheTag("author-jess");
  cacheLife("authors");

  const response = await getProjects();

  if (!response) {
    return notFound();
  }

  // Generate CollectionPage schema
  const collectionPageSchema = generateCollectionPageSchema({
    name: "Projects & Research",
    description:
      "Explore projects and research covering technology, programming, design, and creative endeavors.",
    url: `${getServerSideURL()}/projects`,
    itemCount: response.length,
    items: response.map((project) => ({
      url: `${getServerSideURL()}/projects/${project.slug}`,
    })),
  });

  return (
    <>
      <JsonLd data={collectionPageSchema} />

      <Suspense fallback={<SkeletonGrid />}>
        {response.map((project) => (
          <GridCardProject key={project.id} project={project} />
        ))}
      </Suspense>
    </>
  );
}

export const metadata: Metadata = {
  title: "Projects & Research | Lyovson.com",
  description:
    "Explore projects and research by Rafa and Jess Lyovson covering technology, programming, design, and creative endeavors.",
  keywords: [
    "projects",
    "research",
    "technology",
    "programming",
    "design",
    "creative projects",
    "Rafa Lyovson",
    "Jess Lyovson",
  ],
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects & Research - Lyovson.com",
    description:
      "Explore projects and research covering technology, programming, design, and creative endeavors.",
    type: "website",
    url: "/projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects & Research - Lyovson.com",
    description:
      "Explore projects and research covering technology, programming, design, and creative endeavors.",
    creator: "@lyovson",
    site: "@lyovson",
  },
  other: {
    "article:section": "Projects",
    "article:author": "Rafa Lyovson, Jess Lyovson",
  },
};
