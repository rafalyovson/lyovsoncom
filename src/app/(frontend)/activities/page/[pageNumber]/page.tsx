import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";

import { ActivitiesArchive } from "@/components/ActivitiesArchive";
import { SkeletonGrid } from "@/components/grid";
import { Pagination } from "@/components/Pagination";
import { getPaginatedActivities } from "@/utilities/get-activity";

const ACTIVITIES_PER_PAGE = 25;
const MAX_INDEXED_PAGE = 3;

type Args = {
  params: Promise<{
    pageNumber: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  "use cache";

  const { pageNumber } = await paramsPromise;
  const sanitizedPageNumber = Number(pageNumber);

  cacheTag("activities");
  cacheTag(`activities-page-${pageNumber}`);
  cacheLife("activities");

  if (!Number.isInteger(sanitizedPageNumber)) {
    notFound();
  }

  const response = await getPaginatedActivities(
    sanitizedPageNumber,
    ACTIVITIES_PER_PAGE
  );

  if (!response) {
    return notFound();
  }

  const { docs, totalPages, page } = response;

  return (
    <>
      <Suspense fallback={<SkeletonGrid />}>
        <ActivitiesArchive activities={docs} />
      </Suspense>

      {totalPages > 1 && page && (
        <Pagination
          basePath="/activities/page"
          firstPagePath="/activities"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  "use cache";

  const { pageNumber } = await paramsPromise;
  const sanitizedPageNumber = Number(pageNumber);

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 2) {
    return {
      title: "Not Found | Lyovson.com",
      description: "The requested page could not be found",
    };
  }

  return {
    title: `Activities & Consumption - Page ${sanitizedPageNumber} | Lyóvson.com`,
    description: `Browse activities - Page ${sanitizedPageNumber}`,
    robots: {
      index: sanitizedPageNumber <= MAX_INDEXED_PAGE,
      follow: true,
    },
  };
}




