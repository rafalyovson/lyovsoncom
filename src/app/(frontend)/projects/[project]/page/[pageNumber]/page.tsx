import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { Skeleton } from "@/components//ui/skeleton";
import { CollectionArchive } from "@/components/CollectionArchive";
import { SkeletonGrid } from "@/components/grid/skeleton";
import { Pagination } from "@/components/Pagination";
import { getProject } from "@/utilities/get-project";
import { getPaginatedProjectPosts } from "@/utilities/get-project-posts";

// Number of posts per page for pagination
const POSTS_PER_PAGE = 12;

type Args = {
  params: Promise<{
    project: string;
    pageNumber: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  "use cache";

  const { project: projectSlug, pageNumber } = await paramsPromise;

  // Add cache tags for this specific project page
  cacheTag("posts");
  cacheTag("projects");
  cacheTag(`project-${projectSlug}`);
  cacheTag(`project-${projectSlug}-page-${pageNumber}`);
  cacheLife("posts");

  const project = await getProject(projectSlug);
  if (!project) {
    return notFound();
  }

  const sanitizedPageNumber = Number(pageNumber);
  if (!Number.isInteger(sanitizedPageNumber)) {
    return notFound();
  }

  const postsResponse = await getPaginatedProjectPosts(
    projectSlug,
    sanitizedPageNumber,
    POSTS_PER_PAGE
  );

  if (!postsResponse) {
    return notFound();
  }

  const { docs: posts, totalPages, page } = postsResponse;

  return (
    <>
      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={posts} />
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
}: Args): Promise<Metadata> {
  "use cache";

  const { project: projectSlug, pageNumber } = await paramsPromise;

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

  const projectName = project.name || projectSlug;

  return {
    title: `${projectName} Posts Page ${pageNumber} | Lyovson.com`,
    description: project.description || `Posts from ${projectName}`,
    alternates: {
      canonical: `/projects/${projectSlug}/page/${pageNumber}`,
    },
  };
}

export async function generateStaticParams() {
  "use cache";
  cacheTag("projects");
  cacheLife("static"); // Build-time data doesn't change often

  // Could be enhanced with centralized utility in the future
  const configPromise = (await import("@payload-config")).default;
  const { getPayload } = await import("payload");

  const payload = await getPayload({ config: configPromise });
  const projects = await payload.find({
    collection: "projects",
    limit: 1000,
  });

  const paths: { project: string; pageNumber: string }[] = [];

  for (const project of projects.docs) {
    if (typeof project === "object" && "slug" in project && project.slug) {
      // Generate first page for each project
      paths.push({
        project: project.slug as string,
        pageNumber: "1",
      });
    }
  }

  return paths;
}
