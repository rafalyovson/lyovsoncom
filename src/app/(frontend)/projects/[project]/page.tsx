import configPromise from "@payload-config";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { getPayload } from "payload";
import { Suspense } from "react";
import { CollectionArchive } from "@/components/CollectionArchive";
import { SkeletonGrid } from "@/components/grid/skeleton";
import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@/payload-types";
import { getProject } from "@/utilities/get-project";
import { getProjectPosts } from "@/utilities/get-project-posts";

type PageProps = {
  params: Promise<{
    project: string;
  }>;
};

export default async function Page({ params: paramsPromise }: PageProps) {
  "use cache";

  const { project: projectSlug } = await paramsPromise;

  // Add cache tags for this project
  cacheTag("posts");
  cacheTag("projects");
  cacheTag(`project-${projectSlug}`);
  cacheLife("posts");

  const response = await getProjectPosts(projectSlug);

  if (!response) {
    return notFound();
  }

  const { docs, totalPages, page } = response;

  return (
    <>
      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={docs} />
      </Suspense>
      <div className="container">
        {totalPages > 1 && page && (
          <Suspense fallback={<Skeleton className="mx-auto mt-4 h-10 w-64" />}>
            <Pagination page={page} totalPages={totalPages} />
          </Suspense>
        )}
      </div>
    </>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: PageProps): Promise<Metadata> {
  "use cache";

  const { project: projectSlug } = await paramsPromise;

  // Add cache tags for metadata
  cacheTag("projects");
  cacheTag(`project-${projectSlug}`);
  cacheLife("static"); // Project metadata changes less frequently

  const project = await getProject(projectSlug);

  if (!project) {
    return {
      title: "Project Not Found | Lyovson.com",
      description: "The requested project could not be found",
    };
  }

  const description =
    project.description || `Posts and content from the ${project.name} project`;

  return {
    title: `${project.name} | Lyovson.com`,
    description,
    keywords: [
      project.name,
      "project",
      "collection",
      "posts",
      "articles",
      "Lyovson",
    ],
    alternates: {
      canonical: `/projects/${projectSlug}`,
    },
    openGraph: {
      title: `${project.name}`,
      description,
      type: "website",
      url: `/projects/${projectSlug}`,
      siteName: "Lyovson.com",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name}`,
      description,
      site: "@lyovson",
      creator: "@lyovson",
    },
  };
}

export async function generateStaticParams() {
  "use cache";
  cacheTag("projects");
  cacheLife("static"); // Build-time data doesn't change often

  const payload = await getPayload({ config: configPromise });
  const response = await payload.find({
    collection: "projects",
    limit: 1000,
  });

  const { docs } = response;

  return docs
    .filter(
      (doc): doc is Project =>
        typeof doc === "object" && "slug" in doc && !!doc.slug
    )
    .map(({ slug }) => ({
      project: slug as string,
    }));
}
